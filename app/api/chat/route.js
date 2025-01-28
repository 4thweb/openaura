import { z } from 'zod';
import { streamText, tool } from 'ai';
import fileTools, { FILETOOLS_SYSYTEMMESSAGE } from '@/tools/files';
import { cookies } from 'next/headers';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import SYSTEM_PROMPT from '@/constants/systemPrompt';
import otherTools, { OTHER_SYSYTEMMESSAGE } from '@/tools/other';

export const runtime = 'edge';

const getNodeByPath = (fileSystem, path) => {
  // Remove the leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // If fileSystem is already in the desired format and path is root
  if (fileSystem.type === 'folder' && cleanPath === '') {
    return fileSystem;
  }

  // Split path into parts and traverse
  const parts = cleanPath.split('/').filter(Boolean);
  let current = fileSystem;

  for (const part of parts) {
    if (!current.contents) {
      return null;
    }

    // Find the matching child node
    const node = current.contents.find((item) => item.name === part);
    if (!node) {
      return null;
    }
    current = node;
  }

  return current;
};

const readPath = (fileSystem, path) => {
  try {
    if (!fileSystem) return null;
    
    // Handle the case where fileSystem is already in the desired format
    if (fileSystem.type === 'folder' && path === '/') {
      return {
        type: 'folder',
        description: fileSystem.description,
        contents: fileSystem.contents || []
      };
    }

    const node = getNodeByPath(fileSystem, path);
    if (!node) return null;

    if (node.type === 'folder') {
      // Handle both old and new structures
      if (node.children) {
        // Old structure with children object
        return {
          type: 'folder',
          description: node.description,
          contents: Object.entries(node.children).map(([name, item]) => ({
            name,
            type: item.type,
            description: item.description,
          }))
        };
      } else {
        // New structure with contents array
        return {
          type: 'folder',
          description: node.description,
          contents: node.contents || []
        };
      }
    }

    return {
      type: 'file',
      description: node.description,
      content: node.content
    };
  } catch (e) {
    console.error('Error reading path:', e);
    return null;
  }
};

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages, fileSystem } = await req.json();
    const cookieStore = await cookies();

    const googleKey = cookieStore.get("googleApiKey")?.value
    
    if (!googleKey) {
      return new Response("error");
    }

    const google = createGoogleGenerativeAI({
      apiKey: googleKey
    });

    const result = streamText({
      model: google('gemini-2.0-flash-exp'),
      system: `
      ${SYSTEM_PROMPT}

      ${[
        FILETOOLS_SYSYTEMMESSAGE,
        OTHER_SYSYTEMMESSAGE
      ].join("\n\n")}`,
      tools: {
        ...fileTools,
        ...otherTools,
        readPath: tool({
          description: 'Read the entire file system or specific path',
          parameters: z.object({
            path: z.string().describe('The path to read from. Use "/" for root'),
          }),
          execute: async ({ path }) => {
            try {
              const result = readPath(fileSystem, path);
              console.log('ReadPath result:', result, path);
              return result;
            } catch (e) {
              console.error('ReadPath error:', e);
              return null;
            }
          },
        }),
      },
      messages,
      maxSteps: Infinity,
      maxTokens: 25000,
      temperature: 0.7
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.error('API error:', e);
    return new Response("error");
  }
}