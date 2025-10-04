// MessageList.jsx
import React, { useState } from "react";

export default function MessageList({
  messages,
  currentuser,
  currentUserId,
  recipientname,
  containerRef, // receives ref from parent
  bottomRef     // receives ref from parent
}) {
  const [modalMedia, setModalMedia] = useState(null);

  const renderMedia = (msg) => {
    if (!msg.files || msg.files.length === 0) return null;

    return msg.files.map((fileObj, i) => {
      // fileObj might be an object { url, filename, type } — support either string or object
      const url = typeof fileObj === "string" ? fileObj : fileObj.url || fileObj.path || "";
      const type = typeof fileObj === "string" ? "" : fileObj.type || "";
      const commonClasses =
        "max-w-xs max-h-[250px] my-1 rounded cursor-pointer object-cover";

      if (url.match(/\.(jpeg|jpg|png|gif)$/i) || type.startsWith("image")) {
        return (
          <img
            key={i}
            src={url}
            alt="sent"
            className={commonClasses}
            onClick={() => setModalMedia({ type: "image", url })}
          />
        );
      }

      if (url.match(/\.(mp4|webm|ogg)$/i) || type.startsWith("video")) {
        return (
          <video
            key={i}
            src={url}
            className={commonClasses}
            muted
            playsInline
            onClick={() => setModalMedia({ type: "video", url })}
          />
        );
      }

      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block underline"
        >
          📄 {fileObj.filename || url}
        </a>
      );
    });
  };

  return (
    <>
      <div ref={containerRef} className="flex flex-col overflow-y-auto space-y-3 mb-4 p-4"> {/* Added padding to container */}
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender === currentUserId;
          const alignmentClass = isCurrentUser ? "justify-end" : "justify-start";

          // Define bubble colors based on sender
          const bubbleBgColor = isCurrentUser ? "bg-indigo-700" : "bg-gray-700"; // Example colors
          const textColor = "text-white"; // All text in bubbles is white for contrast

          return (
            <div 
                key={msg._id || index} 
                ref={index === messages.length - 1 ? bottomRef : null} 
                className={`flex ${alignmentClass}`} // This correctly aligns the bubble
            >

              
              {/* This is the MESSAGE BUBBLE DIV */}
              <div 
                className={`max-w-[70%] md:max-w-[60%] lg:max-w-[50%] p-3 rounded-lg shadow-md ${bubbleBgColor} ${textColor} flex flex-col`}
                // flex flex-col makes sure the text, media, and timestamp stack vertically inside the bubble
              >
                {msg.text && <p className="whitespace-pre-wrap text-base mb-1">{msg.text}</p>} {/* Added text-base and mb-1 */}
                {renderMedia(msg)}
                <span className={`block text-xs mt-1 ${isCurrentUser ? "text-blue-200" : "text-gray-400"} self-end`}> {/* self-end pushes timestamp to right within bubble */}
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                  {" from "}
                  {isCurrentUser ? currentuser : recipientname}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {modalMedia && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setModalMedia(null)}
        >
          {modalMedia.type === "image" ? (
            <img src={modalMedia.url} alt="Full" className="max-w-full max-h-full object-contain" />
          ) : (
            <video src={modalMedia.url} className="max-w-full max-h-full" controls autoPlay />
          )}
        </div>
      )}
    </>
  );
}
