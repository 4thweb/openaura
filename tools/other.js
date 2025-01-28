import { z } from "zod";
import { tool } from "ai";

const otherTools = {
  preview: tool({
    name: 'preview',
    description: 'Displays the contents of a specific folder for the client to preview.',
    parameters: z.object({
      folder: z.string().describe('The name of the folder to preview. This should be a valid folder name in the project.'),
    }),
    execute: async ({ folder }) => {
      // Executes the preview action by returning the folder details
      return {
        folder,
        action: "preview",
      };
    },
  }),
};

export const OTHER_SYSYTEMMESSAGE = `
------
OTHER TOOLS SYSTEM MESSAGE
------
- The "preview" tool is used to display a folder's contents for a React project. 
- Before previewing, ensure the folder specified by the user is valid by using the "readPath" tool. 
- If the folder provided is invalid, replace it with the most appropriate folder based on the available file system. 
- The "folder" argument is required and represents the name of the folder you wish to preview.
`;


export default otherTools;