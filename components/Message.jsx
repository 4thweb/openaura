import React from 'react';
import { Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

const handleVoicePlayback = (text, voiceType) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  const voices = synth.getVoices();
  const selectedVoice = voices.find((voice) =>
    voiceType === "male"
      ? voice.name.toLowerCase().includes("male")
      : voice.name.toLowerCase().includes("female")
  );
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  synth.speak(utterance);
};

const Message = ({ message }) => {
  const renderToolInvocations = (toolInvocations) => {
    if (!toolInvocations || toolInvocations.length === 0) return null;

    return (
      <div className="mt-3 space-y-3 w-max max-w-full w-full">
        {toolInvocations.map((tool) => (
          <div key={tool.toolCallId}>
            <div className="bg-gray-500/20 rounded-lg p-3 border border-white/10 text-white/80 hover:border-white/20 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <Terminal size={14} className="text-blue-400" />
                  <span className="font-mono text-blue-400 break-all">{tool.toolName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-700/50 text-xs border border-white/10">
                    {tool.state}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="group mb-2 last:mb-0 w-full">
      <div className={`flex gap-3 items-start ${
        message.role === 'user' 
          ? 'bg-gradient-to-t from-gray-600/20 to-gray-700/10 rounded-lg p-3 px-5' 
          : 'bg-gradient-to-b from-gray-500/20 via-gray-600/20 to-transparent rounded-lg p-3 px-5'
      }`}>
        <div className="flex-1 w-full">          
          {message.content && (
            <div className="prose prose-invert text-left w-full max-w-none text-sm">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-white/80 leading-relaxed">{children}</p>,
                  code: ({ children }) => (
                    <code className="bg-gray-700/50 px-1.5 py-0.5 rounded text-sm">{children}</code>
                  ),
                  pre: ({ children, className }) => {
                    const language = className ? className.replace('language-', '') : '';
                    const code = React.Children.toArray(children)
                      .find(child => 
                        typeof child === 'object' && 
                        child.props && 
                        child.props.className === 'language-jsx'
                      );

                    console.log(children, code)
                    return code ? (
                      <CodeBlock
                        language={language}
                        value={code.props.children}
                      />
                    ) : null;
                  },
                  voiceComponentMale: ({ children }) => (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleVoicePlayback(children[0], "male")}
                    >
                      Play Voice (Male)
                    </button>
                  ),
                  voiceComponentFemale: ({ children }) => (
                    <button
                      className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleVoicePlayback(children[0], "female")}
                    >
                      Play Voice (Female)
                    </button>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          {message.toolInvocations && renderToolInvocations(message.toolInvocations)}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-2 text-left opacity-0 group-hover:opacity-100 transition-opacity pl-5">
        {new Date(message.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default Message;