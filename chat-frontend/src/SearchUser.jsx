export default function SearchUser({ searchInputRef, searchUsername, setSearchUsername, handleSearch, searchError }) {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      
      if (searchUsername.trim()) {
        handleSearch();
      }
    }
  };

  return (
      <div className="flex flex-col mb-4 size-xl justify-self-center">
        
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

        {searchError && (
          <div className="text-red-500 text-sm ml-1">
            {searchError}
          </div>
        )}
      </div>
  );
};