"use client";
import React from "react";
import { SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";

// Function to generate a random alphanumeric string of 200 characters
const generateRandomKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomKey = '';
  for (let i = 0; i < 1000; i++) {
    randomKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomKey;
};

function Preview({ files = {} }) {
  console.log(files)
  
  return (
    <SandpackProvider
      key={generateRandomKey()}  // Generate random 200 character key
      theme="dark"
      className="h-svh w-full [&_.sp-preview-container]:flex [&_.sp-preview-container]:h-full [&_.sp-preview-container]:w-full [&_.sp-preview-container]:grow [&_.sp-preview-container]:flex-col [&_.sp-preview-container]:justify-center [&_.sp-preview-iframe]:grow"
      files={files}
      options={{
        externalResources: [
          "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
        ],
      }}>
      <SandpackLayout>
        <div id="root"></div>
      </SandpackLayout>
      <SandpackPreview
        showNavigator={false}
        showOpenInCodeSandbox={true}
        showRefreshButton={true}
        showRestartButton={true}
        showOpenNewtab={false}
        className="h-svh w-full"
      />
    </SandpackProvider>
  );
}

export default React.memo(Preview)