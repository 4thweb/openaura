import { z } from 'zod';
import { tool } from 'ai';

const fileTools = {
  writePath: tool({
    description: 'Write a file or folder at the specified path, u can also create folders and file inside folders here.',
    parameters: z.object({
      path: z.string().describe('The path to write to'),
      description: z.string().describe('Description of the file or folder'),
      content: z.string().optional().describe('Content of the file (if it is a file)'),
    }),
    execute: async ({ path, description, content }) => {
      return {
        path,
        description,
        content,
        action: 'write'
      }
    },
  }),

  renamePath: tool({
    description: 'Rename a file or folder',
    parameters: z.object({
      path: z.string().describe('The current path'),
      newName: z.string().describe('The new name for the file or folder'),
    }),
    execute: async ({ path, newName }) => {
      return {
        path,
        newName,
        action: 'rename'
      }
    },
  }),

  movePath: tool({
    description: 'Move a file or folder to a new location',
    parameters: z.object({
      oldPath: z.string().describe('The current path of the file or folder'),
      newPath: z.string().describe('The new path to move to'),
    }),
    execute: async ({ oldPath, newPath }) => {
      return {
        oldPath,
        newPath,
        action: 'move'
      }
    },
  }),

  removePath: tool({
    description: 'Remove a file or folder',
    parameters: z.object({
      path: z.string().describe('The path to remove'),
    }),
    execute: async ({ path }) => {
      console.log(path)
      return {
        path,
        action: 'remove'
      }
    },
  }),

  editFile: tool({
    description: 'Edit a file\'s content and/or description',
    parameters: z.object({
      path: z.string().describe('The path of the file to edit'),
      updates: z.object({
        description: z.string().optional().describe('New description for the file'),
        content: z.string().optional().describe('New content for the file'),
      }),
    }),
    execute: async ({ path, updates }) => {
      return {
        path,
        updates,
        action: 'edit'
      }
    },
  }),
};

export const FILETOOLS_SYSYTEMMESSAGE = `
------
ENVIRONMENT TOOLS SYSTEM MESSAGE
------
You can interact with a virtual file system that persists per chat session. Each path should start with / (not C: or file:///).

When users ask you to program or create content, take initiative to:
- Choose appropriate file names and extensions based on the content type
- Create necessary folder structures automatically
- Organize related files logically without asking for confirmation
- Use conventional naming patterns (e.g., 'index.js' for main files, 'styles.css' for styling)
- Create and manage configuration files as needed

The file system supports creating and storing both files and folders. Any code or text files can be stored and will be remembered throughout the chat session, including:
- Source code files (.js, .ts, .jsx, .tsx, .py, .cpp, etc.)
- Text files (.txt, .md)
- Configuration files (.json, .yaml, .env)
- Style files (.css, .scss)
- Vector graphics (.svg)
- HTML files (.html, .htm)

Folders should not have an extension. Binary files (images, videos, music) are not supported.

All files and their contents are persisted in the virtual environment and will be remembered throughout the conversation. You can:
- Read files and folders
- Write new files and folders
- Rename files and folders
- Move files and folders
- Remove files and folders
- Edit file contents and descriptions

For example:
- If user asks to "create a React app", automatically create appropriate files like index.jsx, App.jsx, styles.css
- If user asks to "write a Python script", choose a descriptive filename like "data_processor.py"
- If working on a project, create a suitable folder structure without asking

Remember that this is a virtual environment specific to each chat session. Changes are persistent within the session but don't affect the actual file system.

Also if user wants to create a project and in the folder if there is a project ask whether to delete it.
`;

export default fileTools;