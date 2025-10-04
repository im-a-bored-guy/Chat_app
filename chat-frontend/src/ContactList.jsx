import React from 'react';

const ContactList = ({ contacts, onSelectContact, selectedContactId }) => {
    return (
        <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Chats</h2>
            
            {contacts.length === 0 ? (
                <p className="text-gray-500 text-sm p-2">
                    Start a new chat by searching for a username above.
                </p>
            ) : (
                contacts.map(contact => (
                    <div
                        key={contact._id}
                        onClick={() => onSelectContact(contact)}
                        className={`
                            flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200
                            ${selectedContactId === contact._id 
                                ? 'bg-indigo-700 text-white shadow-md' 
                                : 'bg-[#1C1E36] text-gray-200 hover:bg-[#2C2E46]'
                            }
                        `}
                    >
                        {/* Simple Avatar Placeholder */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 ${selectedContactId === contact._id ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'}`}>
                            {contact.username ? contact.username[0].toUpperCase() : 'U'}
                        </div>
                        <span className="truncate font-medium">
                            {contact.username}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

export default ContactList;