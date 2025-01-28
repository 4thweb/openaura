import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Copy, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
        aria-label="Copy code"
      >
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Copy size={16} className="text-gray-300" />
        )}
      </button>
      <pre className="bg-gray-600/20 border border-white/10 p-3 rounded-lg overflow-x-auto hover:border-white/20 transition-colors">
        <code className={`language-${language || 'javascript'}`}>
          {value}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;