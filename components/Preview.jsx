"use client";
import React, { useEffect, useState } from "react";
import { SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { convertFiles, getFolder } from '@/utils/preview';

function Preview({ fileSystem, folder }) {
  const [files, setFiles] = useState({});
  const [showSandpack, setShowSandpack] = useState(false);

  useEffect(() => {
    const filesData = getFolder(fileSystem, folder);
    const dataFiles = convertFiles(filesData);

    // console.log("FOLDR: ", folder)
    // console.log("FISYS: ", fileSystem)
    // console.log("FILES: ", filesData)
    // console.log("DAFIL: ", dataFiles)

    setFiles(dataFiles);
    setShowSandpack(Object.keys(dataFiles).length > 0);
  }, [folder, fileSystem]);

  useEffect(() => {
    setShowSandpack(Object.keys(files).length > 0);
  }, [files]);
  
  return (
    <>
    {showSandpack ? (
      <SandpackProvider
        id="key000001111111111"
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
    ) : (
      <div className="flex items-center justify-center h-svh">
        <p>Loading...</p>
      </div>
    )}
    </>
  );
}

export default React.memo(Preview)