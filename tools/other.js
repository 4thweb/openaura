import { z } from "zod";
import { tool } from "ai";

const otherTools = (pexelsApiKey) => {
  return {
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
    fetchImages: tool({
      name: "fetchImages",
      description: "Fetches images from the Pexels API based on a search query, you can use this to search images, you can use it to get images for the website you are building.",
      parameters: z.object({
        query: z.string().describe("The search term to find relevant images."),
        perPage: z.number().describe("Number of images to fetch per page (max 10)."),
        page: z.number().describe("The page number for paginated results, default 1."),
      }),
      execute: async ({ query, perPage = 20, page = 1 }) => {
        try {
          const API_KEY = pexelsApiKey;
          const PEXELS_API_URL = `https://api.pexels.com/v1/search`;
          
          const url = `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
          const response = await fetch(url, {
            headers: {
              Authorization: API_KEY,
            },
          });

          if (!response.ok) {
            throw new Error(`Pexels API request failed: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          const results = data.photos.map(photo => ({
            id: photo.id,
            description: photo.alt || "No description available",
            url: photo.src.original,
            thumbnail: photo.src.medium,
            photographer: photo.photographer,
            photographerProfile: photo.photographer_url,
          }));

          return results;
        } catch (error) {
          console.error("Error fetching images from Pexels:", error);
          throw new Error("An error occurred while fetching images. Please try again later.");
        }
      },
    }),
  }
};

export const OTHER_SYSYTEMMESSAGE = `
------
OTHER TOOLS SYSTEM MESSAGE
------
- The "preview" tool displays folder contents for React projects. Validate folder paths using "readPath" before previewing.
- Use "preview" with a valid "folder" name argument.
`;


export default otherTools;