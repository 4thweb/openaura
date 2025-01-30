"use client"
import React, { useState, useEffect, useRef } from "react"
import { ChevronRight, ChevronDown, FolderPlus, FilePlus, X, Menu } from "lucide-react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-python"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markdown"
import { Play } from "lucide-react"
import { useMediaQuery } from "react-responsive"
import { Copy, Check } from 'lucide-react';
import { ArrowDownToLine } from "lucide-react"

const Editor = ({ env, toggleEditor, setPreview }) => {
  const [copied, setCopied] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [selectedFile, setSelectedFile] = useState(null)
  const [expandedFolders, setExpandedFolders] = useState(new Set(["/"]))
  const [isCreating, setIsCreating] = useState(false)
  const [creatingAt, setCreatingAt] = useState("/")
  const [newItemName, setNewItemName] = useState("")
  const [createType, setCreateType] = useState(null)
  const [content, setContent] = useState("")
  const [highlightedContent, setHighlightedContent] = useState("")
  const [isExplorerVisible, setIsExplorerVisible] = useState(isMobile ? false : true)
  const [lineNumbers, setLineNumbers] = useState([])
  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)
  const preRef = useRef(null)

  useEffect(() => {
    const root = env.read("/")
  }, [])

  useEffect(() => {
    if (selectedFile) {
      const content = env.read(selectedFile)?.content || ""
      setContent(content)
      updateLineNumbers(content)
      highlightCode(content, getLanguageFromFileName(selectedFile))
    }
  }, [selectedFile])

  const toggleExplorer = () => setIsExplorerVisible(!isExplorerVisible)

  const getLanguageFromFileName = (filename) => {
    const extension = filename.split(".").pop().toLowerCase()
    const languageMap = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "typescript",
      css: "css",
      html: "html",
      htm: "html",
      json: "json",
      md: "markdown",
      py: "python",
      yml: "yaml",
      yaml: "yaml",
      txt: "plaintext",
    }
    return languageMap[extension] || "plaintext"
  }

  const highlightCode = (code, language) => {
    if (language === "plaintext") {
      setHighlightedContent(code)
      return
    }

    const highlighted = Prism.highlight(code, Prism.languages[language] || Prism.languages.plaintext, language)
    setHighlightedContent(highlighted)
  }

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    updateLineNumbers(newContent)
    env.edit(selectedFile, { content: newContent })
    highlightCode(newContent, getLanguageFromFileName(selectedFile))
  }

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase()

    const iconMap = {
      js: "bxl-javascript text-yellow-400",
      jsx: "bxl-react text-blue-400",
      ts: "bxl-typescript text-blue-600",
      tsx: "bxl-react text-blue-400",
      css: "bxl-css3 text-blue-500",
      scss: "bxl-sass text-pink-500",
      html: "bxl-html5 text-orange-500",
      json: "bx-code-curly text-yellow-200",
      md: "bx-markdown text-white",
      py: "bxl-python text-blue-400",
      rb: "bx-diamond text-red-500",
      php: "bxl-php text-purple-400",
      java: "bxl-java text-red-400",
      cpp: "bx-code-alt text-blue-300",
      c: "bx-code-alt text-blue-300",
      go: "bx-code-block text-blue-400",
      rs: "bx-cog text-orange-400",
      svg: "bx-image text-purple-300",
      png: "bx-image text-purple-300",
      jpg: "bx-image text-purple-300",
      pdf: "bx-file-pdf text-red-400",
      zip: "bx-archive text-yellow-300",
      gitignore: "bxl-git text-orange-400",
      env: "bx-key text-green-400",
      sql: "bx-data text-blue-300",
      yml: "bx-code-alt text-red-300",
      yaml: "bx-code-alt text-red-300",
      txt: "bx-file text-gray-400",
    }

    const iconClass = iconMap[extension] || "bx-file text-gray-400"
    return <i className={`bx ${iconClass} text-lg`}></i>
  }

  const startCreating = (type, path) => {
    setIsCreating(true)
    setCreateType(type)
    setCreatingAt(path)
    setNewItemName("")
  }

  const cancelCreating = () => {
    setIsCreating(false)
    setCreateType(null)
    setCreatingAt("/")
    setNewItemName("")
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newItemName) return

    const path = `${creatingAt}${creatingAt.endsWith("/") ? "" : "/"}${newItemName}`
    if (createType === "folder") {
      env.write(path, "Folder")
      setExpandedFolders((prev) => new Set([...prev, creatingAt]))
    } else {
      env.write(path, "File", "")
      setSelectedFile(path)
    }

    cancelCreating()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const sortItems = (items) => {
    const folders = items.filter((item) => item.type === "folder")
    const files = items.filter((item) => item.type !== "folder")
    const sortByName = (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    return [...folders.sort(sortByName), ...files.sort(sortByName)]
  }

  const updateLineNumbers = (code) => {
    const lines = code.split("\n").length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }

  const renderFileTree = (path = "/") => {
    const node = env.read(path)
    if (!node) return null

    const sortedContents = sortItems(node.contents || [])

    return (
      <div>
        {sortedContents.map(({ name, type }) => {
          const fullPath = `${path}${path.endsWith("/") ? "" : "/"}${name}`

          if (type === "folder") {
            const isExpanded = expandedFolders.has(fullPath)
            return (
              <div key={fullPath}>
                <div
                  className="flex items-center gap-1 w-full hover:bg-gray-500/10 px-2 py-1 rounded text-sm group"
                  onClick={() => toggleFolder(fullPath)}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="flex-1">{name}</span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const modifiedPath = fullPath.startsWith("/") ? fullPath.substring(1) : fullPath;

                        setPreview(modifiedPath);
                      }}
                      className="px-1 hover:bg-gray-600 rounded"
                    >
                      <Play size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        startCreating("file", fullPath)
                      }}
                      className="px-1 hover:bg-gray-600 rounded"
                    >
                      <FilePlus size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        startCreating("folder", fullPath)
                      }}
                      className="px-1 hover:bg-gray-600 rounded"
                    >
                      <FolderPlus size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        env.download(fullPath)
                      }}
                      className="px-1 hover:bg-gray-600 rounded"
                    >
                      <ArrowDownToLine size={14} />
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="pl-3">
                    {renderFileTree(fullPath)}
                    {isCreating && creatingAt === fullPath && (
                      <form onSubmit={handleCreate} className="flex items-center px-2 py-1">
                        <input
                          autoFocus
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="flex-1 bg-gray-500/10 text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                          placeholder={`New ${createType}...`}
                        />
                        <button type="button" onClick={cancelCreating} className="ml-2 p-1 hover:bg-gray-700 rounded">
                          <X size={14} />
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )
          }

          return (
            <button
              key={fullPath}
              className={`flex items-center gap-1 w-full px-2 py-1 rounded text-sm ${
                selectedFile === fullPath ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedFile(fullPath)}
            >
              {getFileIcon(name)}
              <span>{name}</span>
            </button>
          )
        })}
      </div>
    )
  }

  const handleScroll = (e) => {
    if (lineNumbersRef.current && preRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop
      preRef.current.scrollTop = e.target.scrollTop
      preRef.current.scrollLeft = e.target.scrollLeft
    }
  }

  return (
    <div className="h-svh flex bg-gray-500/10 text-gray-200">
      {/* File Explorer */}
      {isExplorerVisible && (
        <div className="w-full md:w-64 border-r border-gray-700 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between px-2 w-full border-b border-white/20 mb-2 p-2 px-3">
              <span className="text-[11px] font-medium inline-block">EXPLORER</span>
              <div className="flex items-center gap-1">
                <button onClick={() => startCreating("file", "/")} className="p-1 hover:bg-gray-700 rounded">
                  <FilePlus size={14} />
                </button>
                <button onClick={() => startCreating("folder", "/")} className="p-1 hover:bg-gray-700 rounded">
                  <FolderPlus size={14} />
                </button>
                <button
                  onClick={() => toggleExplorer()}
                  className="p-1 hover:bg-gray-700 rounded">
                  <X size={16} onClick={() => toggleExplorer()} />
                </button>
              </div>
            </div>
            <div className="p-2">
              {renderFileTree()}
              {isCreating && creatingAt === "/" && (
                <form onSubmit={handleCreate} className="flex items-center px-2 py-1">
                  <input
                    autoFocus
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 bg-gray-800 text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    placeholder={`New ${createType}...`}
                  />
                  <button type="button" onClick={cancelCreating} className="ml-2 p-1 hover:bg-gray-700 rounded">
                    <X size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className={`flex-1 overflow-hidden ${isExplorerVisible ? "" : "ml-0"}`}>
        <div className="px-4 h-10 py-2 bg-gray-800/50 text-sm border-b border-gray-700 flex items-center gap-2">
          <button onClick={toggleExplorer} className="p-1 rounded hover:bg-gray-700 text-gray-200">
            <Menu size={14} />
          </button>
          {selectedFile ? (
            <div className="flex items-center gap-2">
              {getFileIcon(selectedFile.split("/").pop())}
              {selectedFile.split("/").pop()}
              <button 
                onClick={handleCopy}
                aria-label="Copy code">
                {copied ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} className="text-gray-300" />
                )}
              </button>
            </div>
          ) : (
            "Editor"
          )}
          <button
            onClick={() => toggleEditor()}
            className="text-white focus:outline-none pr-4 flex-grow flex items-center justify-end"
          >
            <X size={16} onClick={() => toggleEditor()} />
          </button>
        </div>
        {selectedFile ? (
          <div className="h-full flex">
            {/* Line Numbers */}
            <div
              ref={lineNumbersRef}
              className="bg-gray-800 text-gray-500 text-right p-4 font-mono text-sm overflow-hidden"
            >
              {lineNumbers.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
            {/* Editor */}
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                className="absolute inset-0 w-full h-full bg-transparent overflow-auto text-transparent whitespace-pre caret-white p-4 font-mono text-sm resize-none focus:outline-none z-10"
                value={content}
                onChange={handleContentChange}
                onScroll={handleScroll}
                spellCheck={false}
              />
              <pre
                ref={preRef}
                onScroll={handleScroll}
                className="absolute inset-0 p-4 font-mono text-sm text-gray-200 whitespace-pre overflow-auto"
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">Select a file to edit</div>
        )}
      </div>
    </div>
  )
}

export default Editor