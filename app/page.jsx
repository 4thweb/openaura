"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import useEnvironment from '@/hooks/useEnviroment';
import Editor from '@/components/Editor';
import { Folder, FolderOpen, X, RefreshCw, Settings } from 'lucide-react';
import execute from '@/utils/toolCall';
import Message from '@/components/Message';
import { smoothStream } from 'ai';
import { convertFiles, getFolder } from '@/utils/preview';
import Preview from '@/components/Preview';
import { useRouter } from 'next/navigation';
import ChatInputForm from '@/components/ChatInputForm';
import { getCookie } from 'cookies-next';
import { Loader } from 'lucide-react';

export default function Chat() {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const env = useEnvironment('chat-session');
  const [fileSystem, setFileSystem] = useState({});
  const [previewFileSystem, setPreviewFileSystem] = useState({});
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [dataFiles, setDataFiles] = useState({});
  const [dataFolder, setDataFolder] = useState("");
  const [loading, setLoading] = useState(true);

  // Check for the required cookie
  const [isCookiePresent, setIsCookiePresent] = useState(false);

  const toggleEditor = (open = false) => {
    if (!!isPreviewVisible) setIsPreviewVisible(false);
    setIsEditorVisible(!!open ? open : !isEditorVisible);
  };

  const togglePreview = (open = false) => {
    if (!!isEditorVisible) setIsEditorVisible(false);
    setIsPreviewVisible(!!open ? open : !isPreviewVisible);
  };

  const reloadPreview = async () => {
    const files = getFolder(previewFileSystem, dataFolder);
    const dataFiles = convertFiles(files);
    console.log(dataFiles, dataFolder, files, previewFileSystem);
    setDataFiles(dataFiles);
  };

  const setPreview = (folder) => {
    const files = getFolder(previewFileSystem, folder);
    const dataFiles = convertFiles(files);
    setDataFolder(folder);
    setDataFiles(dataFiles);
    setTimeout(() => {
      togglePreview(true);
    }, 500)
  };

  const getFileSystemState = async () => {
    const rootContent = env.readAll('/');
    return rootContent;
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
    api: '/api/chat',
    experimental_transform: smoothStream(),
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onToolCall: async ({ toolCall }) => {
      const { toolName, args } = toolCall;
      let result;

      if (toolName === "preview") {
        const newFileSystem = await getFileSystemState();
        setFileSystem(newFileSystem);
        setPreviewFileSystem(newFileSystem);

        let folder = args.folder;
        setDataFolder(folder);
        setPreview(folder);
        return;
      }

      execute({
        toolName,
        args,
        env,
        result,
      });

      const newFileSystem = await getFileSystemState();
      setFileSystem(newFileSystem);
      setPreviewFileSystem(newFileSystem);

      return result;
    },
    onFinish: (message) => {
      console.log(message);
    },
    body: {
      fileSystem,
    },
  });

  useEffect(() => {
    getFileSystemState().then(setFileSystem);

    const cookieKey = getCookie('googleApiKey') || '';
    if (cookieKey) {
      setIsCookiePresent(!!cookieKey);
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    getFileSystemState().then(setPreviewFileSystem);
  }, []);

  const handleSubmitWithFS = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentFS = await getFileSystemState();
    setFileSystem(currentFS);

    return handleSubmit(
      {
        role: 'user',
        content: input,
      },
      {
        data: {
          fileSystem: currentFS,
        },
      }
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-gray-200">
        <Loader size={28} className="animate-spin" />
      </div>
    );
  }

  if (!isCookiePresent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/30 text-white">
        <div className="text-center p-6 px-12 bg-gray-600/20 mx-auto border border-gray-800 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Attention</h1>
          <p className="text-gray-400 mb-6">
            Please configure your API key.
          </p>
          <div className="flex flex-col justify-center items-center sm:flex-row gap-4">
            <button
              onClick={() => router.push('/settings')}
              className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Settings
            </button>
            <button
              onClick={() => router.refresh()} // Add your retry logic here
              className="w-full sm:w-auto bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-svh max-h-svh text-white">
      <div className="flex flex-col flex-1 h-svh">
        <div className={`fixed top-0 left-0 w-full flex h-10 justify-between items-center bg-gradient-to-b from-black via-black/80 to-transparent p-3 px-4 z-[999] ${(isEditorVisible || isPreviewVisible) ? "hidden sm:block sm:w-1/2 2xl:w-2/3" : ""}`}>
          <div className="flex justify-between items-center w-full max-w-2xl mx-auto">
            <h1 className="text-sm font-bold flex items-center gap-2">
              <img src='/logo.webp' className='opacity-70 w-5 h-5'/>
              Aura
              <span className='text-[9px] bg-blue-800/60 rounded-full px-2'>0.4.1</span>
            </h1>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => {
                  router.push("/settings");
                }}
                className="rounded hover:bg-gray-700 transition-colors p-1"
              >
                <Settings size={14} />
              </button>
              <button
                onClick={() => toggleEditor()}
                className="rounded hover:bg-gray-700 transition-colors p-1"
              >
                {isEditorVisible ? <Folder size={14} /> : <FolderOpen size={14} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 px-2 h-[80vh] w-full max-w-2xl mx-auto">
          <div className="overflow-y-auto pt-20 pb-32 h-full flex flex-col text-center">
            {messages.length === 0 ? (
              <div className="text-gray-400 md:max-w-[60vw] h-full flex flex-col justify-center items-center">
                <img src='/logo.webp' className='opacity-80 dark:opacity-70 w-20 h-20 roundedfull mb-4'/>
                <h2 className="text-lg font-bold text-white mb-2">Welcome to Aura</h2>
                <div className="mt-2">
                  <p className="italic text-xs text-gray-500">
                    "Empowering your ideas, one message at a time."
                  </p>
                </div>
              </div>
            ) : (
              messages.map((m) => <Message key={m.id} message={m}/>)
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className={`fixed bottom-0 left-0 w-full pb-4 pt-4 px-6 z-[99] bg-gradient-to-t from-black via-black to-transparent z-[999] ${(isEditorVisible || isPreviewVisible) ? "hidden sm:block sm:w-1/2 2xl:w-2/3" : ""}`}>
          {error ? (
            <div className='w-full p-2 flex flex-col justify-center items-center gap-2 text-red-300'>
              <div>An error occured</div>
              <button type="button" onClick={() => reload()} className='bg-red-300 p-2 px-4 rounded-full flex justify-center items-center gap-2 text-red-900 border border-red-900'>
                <RefreshCw width={14} />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <ChatInputForm
              input={input}
              handleInputChange={handleInputChange}
              handleSubmitWithFS={handleSubmitWithFS}
              isLoading={isLoading} />
          )}
        </div>
      </div>

      {isEditorVisible && (
        <div
          className={`fixed md:static inset-0 bg-black md:w-1/2 2xl:w-1/3 md:border-l border-gray-700 overflow-y-auto z-50`}
        >
          <Editor env={env} toggleEditor={toggleEditor} setPreview={setPreview} />
        </div>
      )}
      {isPreviewVisible && (
        <div
          className={`flex flex-col fixed md:static inset-0 bg-black md:w-1/2 2xl:w-1/3 md:border-l border-gray-700 overflow-y-auto z-50`}
        >
          <div className="flex justify-between items-center px-4 py-2 h-10 block bg-gray-500/30 text-sm border-b border-gray-700 flex items-center gap-2">
            <b>PREVIEW</b>
            <div className='flex justify-end items-center gap-2'>
              <button
                onClick={reloadPreview}
                className="text-white focus:outline-none p-1 flex items-center justify-center"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => togglePreview(false)}
                className="text-white focus:outline-none p-1 pr-4 flex-grow flex items-center justify-end"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className='flex-grow overflow-auto'>
            <Preview files={dataFiles} />
          </div>
        </div>
      )}
    </div>
  );
}