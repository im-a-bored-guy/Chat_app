import { useState, useEffect, useRef } from "react";
import SearchUser from "./SearchUser";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import ContactList from "./ContactList"; 
import { findUserByUsername, loadMessages, sendMessage, loadContactList } from "./api";
import { useNavigate } from "react-router-dom";

const currentUser = JSON.parse(localStorage.getItem("user"));
const currentUserId = currentUser?._id;

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [searchUsername, setSearchUsername] = useState("");
    const [recipient, setRecipient] = useState(null);
    const [searchError, setSearchError] = useState("");
    const [contacts, setContacts] = useState([]); 
    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const navigate = useNavigate();

    const [isCollapsed, setIsCollapsed] = useState(false); 

    const lastMessageIdRef = useRef(null);
    const forceScrollRef = useRef(false);

    const scrollToBottom = (smooth = true) => {
        requestAnimationFrame(() => {
            if (bottomRef.current && typeof bottomRef.current.scrollIntoView === "function") {
                bottomRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "nearest" });
            } else if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        });
    };

    const loadChatHistory = async () => {
        if (!recipient?._id) return;
        try {
            const data = await loadMessages(currentUserId, recipient._id);
            setMessages(data || []);
        } catch (err) {
            console.error("Fetch messages error:", err);
        }
    };
    
    const fetchContacts = async () => {
        if (!currentUserId) return;
        try {
            const data = await loadContactList(currentUserId);
            // Filter out the current user from the contact list if they appear
            setContacts(data.filter(u => u._id !== currentUserId) || []);
        } catch (err) {
            console.error("Fetch contacts error:", err);
        }
    };
    
    // EFFECT: Load contacts on component mount
    useEffect(() => {
        fetchContacts();
    }, []); 

    useEffect(() => {
        if (recipient?._id) {
            forceScrollRef.current = true;
            loadChatHistory();
        } else {
            setMessages([]);
            lastMessageIdRef.current = null;
        }
    }, [recipient?._id]);

    useEffect(() => {
        if (!recipient?._id) return;
        const id = setInterval(loadChatHistory, 1500);
        return () => clearInterval(id);
    }, [recipient?._id]);

    useEffect(() => {
        if (!messages || messages.length === 0) {
            lastMessageIdRef.current = null;
            return;
        }

        const latest = messages[messages.length - 1];
        const prevId = lastMessageIdRef.current;
        const isNew = latest && prevId !== latest._id;

        let nearBottom = true;
        if (containerRef.current) {
            const el = containerRef.current;
            const thresholdPx = 150;
            nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < thresholdPx;
        }

        if (isNew) {
            if (forceScrollRef.current) {
                scrollToBottom(false);
                forceScrollRef.current = false;
            } else if (latest.sender === currentUserId) {
                scrollToBottom(true);
            } else if (nearBottom) {
                scrollToBottom(true);
            }
        }

        lastMessageIdRef.current = latest?._id;
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!text && files.length === 0) || !recipient?._id) return;

        try {
            await sendMessage({
                sender: currentUserId,
                recipient: recipient._id,
                text,
                files,
            });
            setText("");
            setFiles([]);
            await loadChatHistory();
            
            // Re-fetch contacts after sending a message, in case it's a new conversation
            fetchContacts(); 
        } catch (err) {
            console.error("Send error:", err);
        }
    };

    const handleSearch = async () => {
        if (!searchUsername.trim()) return;
        try {
            const foundUser = await findUserByUsername(searchUsername.trim());
            setRecipient(foundUser);
            setSearchError("");
            // Clear search field after successful search
            setSearchUsername(""); 
            // If search is successful, also ensure we fetch the updated contact list
            fetchContacts(); 
        } catch (err) {
            setRecipient(null);
            setSearchError("User not found");
        }
    };
    
    const handleContactClick = (contact) => {
        setRecipient(contact);
    };

    const handleLogout = () => navigate("/logout");

    // SIMPLE TOGGLE HANDLER
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    
    const sidebarWidth = isCollapsed ? 'w-0' : 'basis-1/4'; 
    const chatAreaWidth = isCollapsed ? 'basis-full' : 'basis-3/4';
    const sidebarContentClass = isCollapsed ? 'hidden' : 'block'; 
    
    // Position the button exactly at the edge of the sidebar. 
    const buttonPosition = isCollapsed ? '1px' : '24%'; 

    return (
        <div className="flex h-screen p-2 relative">
            
            {/* -------------------- LEFT SIDEBAR (COLLAPSIBLE) -------------------- */}
            <div 
                className={`flex-shrink-0 flex flex-col border-r-2 border border-[#3C3F5E] transition-transform duration-1000 overflow-hidden ${sidebarWidth} ${isCollapsed ? 'p-0' : 'p-3'}`}
            >
                
                {/* EXPANDED CONTENT AREA - Completely hidden when w-0 */}
                <div className={`flex flex-col flex-grow ${sidebarContentClass}`}>
                    <SearchUser
                        searchUsername={searchUsername}
                        setSearchUsername={setSearchUsername}
                        handleSearch={handleSearch}
                        searchError={searchError}
                    />
                    
                    <div className="flex-grow overflow-y-auto mb-4">
                        <ContactList
                            contacts={contacts}
                            onSelectContact={handleContactClick}
                            selectedContactId={recipient?._id}
                        />
                    </div>
                    
                    <div className="mt-auto">
                        <button
                            onClick={handleLogout}
                            className="text-white rounded mb-2 w-full text-center"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* -------------------- ABSOLUTE TOGGLE BUTTON -------------------- */}
            <button
                onClick={toggleSidebar}
                className="absolute top-1/2 -ml-3 transform -translate-y-1/2 p-1 bg-[#3C3F5E] text-white rounded-full shadow-lg z-20 hover:bg-gray-800 transition-all duration-500"
                style={{ left: buttonPosition }}
                title={isCollapsed ? 'Expand Contacts' : 'Collapse Contacts'}
            >
                {isCollapsed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                )}
            </button>

            {/* -------------------- RIGHT CHAT AREA -------------------- */}
            <div className={`flex flex-col p-4 ${chatAreaWidth}`}> 

              {recipient?._id ? (
                  <>
                      <p className="p-3 mb-4 bg-[#1C1E36] top-0 m-0">
                          <strong>{recipient?.username}</strong>
                      </p>

                      <div className="flex-grow overflow-y-auto">
                          <MessageList
                              messages={messages}
                              currentUserId={currentUserId}
                              currentuser={currentUser?.name}
                              recipientname={recipient?.name}
                              containerRef={containerRef} 
                              bottomRef={bottomRef}
                          />
                      </div>
                      
                      <div className="w-full flex justify-center mt-4">
                          <div className="w-full max-w-4xl">
                              <MessageForm
                                  currentUserId={currentUserId}
                                  recipientId={recipient._id}
                                  onMessageSent={loadChatHistory}
                                  text={text}
                                  setText={setText}
                                  files={files}
                                  setFiles={setFiles}
                                  handleSend={handleSend}
                              />
                          </div>
                      </div>
                  </>
              ) : (
                  <h1 className="text-3xl font-bold">Select a user to start a conversation</h1>
              )}
            </div>
        </div>
    );
}