import { z } from 'zod';
import { tool } from 'ai';
import { experimental_wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { generateText } from 'ai';

const aiTools = (groq, modelName = 'deepseek-r1-distill-llama-70b') => {
  return {
    think: tool({
      description: 'Use this tool to enhance thought processes before making projects for better output.',
      parameters: z.object({
        prompt: z.string().describe('The refined user input for AI to process.'),
      }),
      execute: async ({ prompt }) => {
        try {
          const enhancedModel = experimental_wrapLanguageModel({
            model: groq(modelName),
            middleware: extractReasoningMiddleware({ tagName: 'think' }),
          });

          const result = await generateText({
            model: enhancedModel,
            prompt,
          });

          console.log(result)

          return result;
        } catch (error) {
          console.error('Error in think tool:', error);
          return 'An error occurred while processing your request.';
        }
      },
    }),
  };
};

export const AITOOLS_SYSTEMMESSAGE = `
------
AI TOOLS SYSTEM MESSAGE
------

- Use the thinking tool whenever user asks for a complex guestion like for creating a project or editing a project.
`;

export default aiTools;
