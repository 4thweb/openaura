import { ArrowUp } from "lucide-react";
import { Loader } from "lucide-react";
import { useRef } from "react";

const ChatInputForm = ({ 
  input, 
  handleInputChange, 
  handleSubmitWithFS, 
  isLoading 
}) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    // Check if it's a mobile device
    const isMobile = window.innerWidth <= 768;

    // On desktop or larger screens, allow Shift+Enter for new line
    if (!isMobile && e.key === 'Enter' && e.shiftKey) {
      return;
    }

    // On desktop, submit on Enter
    // On mobile, only submit via submit button
    if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitWithFS(e);
    }

    const textarea = e.target;
    textarea.style.height = ""; // Reset to default height
  };

  const handleTextareaChange = (e) => {
    handleInputChange(e);
    
    // Dynamic height adjustment
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()

        textareaRef.current.height = ""
        handleSubmitWithFS(e)
      }} 
      className="relative max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1 bg-neutral-900/90 px-4 py-3 rounded-lg border-transparent transition-all border border-gray-600/40 hover:border-gray-600">
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent max-h-[250px] text-white text-sm outline-none resize-none"
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading}
            style={{ overflowY: "hidden" }}
          />
          <div className="flex justify-end items-center">
            <button
              type="submit"
              className={`rounded-md transition-all bg-blue-400/20 flex justify-center items-center p-1 ${
                isLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-200 hover:text-blue-300 hover:scale-105'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatInputForm;