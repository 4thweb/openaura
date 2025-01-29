const getFileSystemState = async (env) => {
  const rootContent = env.readAll('/');
  return rootContent;
};

function convertFiles(fileSystem) {
  // Only proceed if fileSystem has contents
  if (!fileSystem || !fileSystem.contents) return {};

  const exampleFiles = {};

  function processContents(contents, parentPath = "") {
    contents.forEach((item) => {
      const currentPath = `${parentPath}/${item.name}`;
      if (item.type === "folder") {
        // exampleFiles[currentPath + "/"] = {
        //   description: item.description || "",
        //   contents: {},
        // };
        if (item.contents) {
          processContents(item.contents, currentPath);
        }
      } else if (item.type === "file") {
        exampleFiles[currentPath] = item.content || ""
      }
    });
  }

  processContents(fileSystem.contents);
  return exampleFiles;
}

function getFolder(fileSystem, folderName) {
  // Remove leading slash if present
  if (folderName.startsWith("/")) {
    folderName = folderName.slice(1);
  }

  // Only proceed if fileSystem has contents
  if (!fileSystem || !fileSystem.contents) return null;

  let targetFolder = null;

  function searchFolder(contents, parentPath = "") {
    contents.forEach((item) => {
      if (item.type === "folder" && item.name === folderName) {
        targetFolder = {
          path: `${parentPath}/${item.name}`,
          description: item.description || "",
          contents: item.contents || [],
        };
      } else if (item.type === "folder" && item.contents) {
        searchFolder(item.contents, `${parentPath}/${item.name}`);
      }
    });
  }

  searchFolder(fileSystem.contents);
  return targetFolder;
}

export { convertFiles, getFolder }