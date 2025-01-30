"use client";
import JSZip from 'jszip';
import { useState, useEffect } from 'react';

const useEnviroment = (id) => {
  if (id === "") return {
    read: () => {},
    write: () => {}
  };

  // Initialize or get the file system from localStorage
  const [fileSystem, setFileSystem] = useState(() => {
    // Only attempt localStorage access in the browser
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`fs-${id}`);
      return stored ? JSON.parse(stored) : { root: { type: 'folder', description: 'Root folder', children: {} } };
    }
    return { root: { type: 'folder', description: 'Root folder', children: {} } };
  });

  // Sync with localStorage whenever fileSystem changes
  useEffect(() => {
    localStorage.setItem(`fs-${id}`, JSON.stringify(fileSystem));
  }, [fileSystem, id]);

  // Helper function to get a node by path
  const getNodeByPath = (path) => {
    const parts = path.split('/').filter(Boolean);
    let current = fileSystem.root;

    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }
    return current;
  };

  // Helper function to get parent node and filename from path
  const getParentAndName = (path) => {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    let current = fileSystem.root;
    
    for (const part of parts) {
      if (!current.children[part]) {
        return null;
      }
      current = current.children[part];
    }
    
    return { parent: current, name: fileName };
  };

  const read = (path) => {
    const node = getNodeByPath(path);
    if (!node) return null;

    if (node.type === 'folder') {
      return {
        type: 'folder',
        description: node.description,
        contents: Object.entries(node.children).map(([name, item]) => ({
          name,
          type: item.type,
          description: item.description,
        }))
      };
    }

    return {
      type: 'file',
      description: node.description,
      content: node.content
    };
  };

  const download = async (path) => {
    if (typeof window === 'undefined') return false; // Ensure client-side execution

    const node = getNodeByPath(path);
    if (!node || node.type !== 'folder') return false;
  
    const zip = new JSZip();
  
    const addToZip = (zipFolder, folderNode) => {
      Object.entries(folderNode.children).forEach(([name, child]) => {
        if (child.type === 'file') {
          zipFolder.file(name, child.content || '');
        } else if (child.type === 'folder') {
          const newFolder = zipFolder.folder(name);
          addToZip(newFolder, child);
        }
      });
    };
  
    addToZip(zip, node);
  
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${path.replace(/\//g, '_') || 'folder'}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    return true;
  };

  const readAll = (path) => {
    const node = getNodeByPath(path);
    if (!node) return null;

    const readNode = (node) => {
        if (node.type === 'folder') {
            return {
                type: 'folder',
                description: node.description,
                contents: Object.entries(node.children).map(([name, child]) => ({
                    name,
                    ...readNode(child)
                }))
            };
        } else if (node.type === 'file') {
            return {
                type: 'file',
                description: node.description,
                content: node.content
            };
        }

        return null;
    };

    return readNode(node);
  };

  const write = (path, description, content = null) => {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    let current = { ...fileSystem };
    let node = current.root;

    // Create folders along the path if they don't exist
    for (const part of parts) {
      if (!node.children) {
        node.children = {};
      }
      if (!node.children[part]) {
        node.children[part] = { type: 'folder', description: 'Folder', children: {} };
      }
      node = node.children[part];
    }

    // Determine if it's a file or folder based on presence of extension
    const isFolder = !fileName.includes('.');
    node.children = node.children || {};
    node.children[fileName] = isFolder
      ? { type: 'folder', description, children: {} }
      : { type: 'file', description, content: content || '' };

    setFileSystem(current);
    return true;
  };

  const rename = (path, newName) => {
    const { parent, name } = getParentAndName(path);
    if (!parent || !parent.children[name]) return false;

    const newFS = { ...fileSystem };
    const targetNode = JSON.parse(JSON.stringify(parent.children[name]));
    delete parent.children[name];
    parent.children[newName] = targetNode;

    setFileSystem(newFS);
    return true;
  };

  const move = (oldPath, newPath) => {
    const sourceNode = getNodeByPath(oldPath);
    if (!sourceNode) return false;

    const { parent: sourceParent, name: sourceName } = getParentAndName(oldPath);
    const { parent: targetParent, name: targetName } = getParentAndName(newPath);

    if (!sourceParent || !targetParent) return false;

    const newFS = { ...fileSystem };
    const nodeCopy = JSON.parse(JSON.stringify(sourceParent.children[sourceName]));
    delete sourceParent.children[sourceName];
    targetParent.children[targetName] = nodeCopy;

    setFileSystem(newFS);
    return true;
  };

  const remove = (path) => {
    const { parent, name } = getParentAndName(path);
    if (!parent || !parent.children[name]) return false;

    const newFS = { ...fileSystem };
    delete parent.children[name];
    setFileSystem(newFS);
    return true;
  };

  const edit = (path, updates) => {
    const { parent, name } = getParentAndName(path);
    if (!parent || !parent.children[name]) return false;

    const node = parent.children[name];
    if (node.type !== 'file') return false;

    const newFS = { ...fileSystem };
    parent.children[name] = {
      ...node,
      description: updates.description || node.description,
      content: updates.content !== undefined ? updates.content : node.content,
    };

    setFileSystem(newFS);
    return true;
  };

  return {
    read,
    write,
    rename,
    move,
    remove,
    edit,
    readAll,
    download
  };
};

export default useEnviroment;