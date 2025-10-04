export default function SearchUser({ searchInputRef, searchUsername, setSearchUsername, handleSearch, searchError }) {

  const handleKeyDown = (e) => {
    // Check if the pressed key is Enter
    if (e.key === 'Enter') {
      // Prevent the default browser action
      e.preventDefault(); 
      
      // Call the search function if the username field is not empty
      if (searchUsername.trim()) {
        handleSearch();
      }
    }
  };

  return (
      // Changed main container to flex-col and removed 'gap-2' from here, 
      // replacing it with margin on the row below.
      <div className="flex flex-col mb-4 size-xl justify-self-center">
        
        {/* Input and Button Row */}
        <div className="flex gap-2 items-center mb-2"> 
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Enter username to chat"
            className="border p-2 rounded flex-1"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {/* Error Message Row (on the next line) */}
        {searchError && (
          <div className="text-red-500 text-sm ml-1">
            {searchError}
          </div>
        )}
      </div>
  );
};