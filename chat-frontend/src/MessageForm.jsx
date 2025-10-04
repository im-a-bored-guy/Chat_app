import React from "react"; 


export default function MessageForm({ currentUserId, recipientId, onMessageSent, text, setText, files, setFiles, handleSend }) {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      if (text.trim() || files.length > 0) {
        handleSend(e);
      }
    }
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2 w-full p-2 bg-[#1C1E36] rounded-xl shadow-lg">
      
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown} 
        placeholder="Type a message…"
        className="flex-1 border-0 rounded-lg p-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
      />
      
      <div className="relative flex items-center">
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer text-gray-400 hover:text-indigo-400 transition-colors duration-150 p-2"
          title={files.length > 0 ? `${files.length} files attached` : "Attach files"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a2 2 0 102.829 2.828l6.414-6.414"/>
          </svg>
        </label>
        <input
          id="file-upload"
          name="files"
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="hidden" // Hides the default file input button
        />
        {/* Visual indicator for attached files */}
        {files.length > 0 && (
            <span className="absolute top-1 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{files.length}</span>
        )}
      </div>
      
      {/* 3. Send Button */}
      <button 
        type="submit" 
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150"
        disabled={!text.trim() && files.length === 0}
      >
        Send
      </button>
    </form>
  );
}