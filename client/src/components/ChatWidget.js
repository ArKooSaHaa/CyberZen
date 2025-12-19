import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatWidget.css";
import {
  createOrEnsureChat,
  sendMessage,
  subscribeToMessages,
} from "../services/chatService";
import { getCurrentFirebaseUser } from "../services/firebaseAuth";
import { v4 as uuid } from "uuid";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState(null);
  const messagesRef = useRef(null);

  // ---------------------------
  // INITIALIZE CHAT SESSION
  // ---------------------------
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentFirebaseUser();

        let id;
        let displayName;
        let email;

        if (user && user.uid) {
          // LOGGED-IN USER → use Firebase UID
          id = user.uid;
          displayName = user.displayName || user.email?.split("@")[0] || "User";
          email = user.email || null;
        } else {
          // GUEST USER → create ONE guest ID stored in Firestore automatically
          id = "guest_" + uuid();
          displayName = "Guest User";
          email = null;
        }

        setChatId(id);

        // Ensure chat exists and keep user identity consistent
        await createOrEnsureChat(id, {
          displayName,
          firebaseUid: user?.uid || null,
          email: email,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error initializing chat:", err);
      }
    })();
  }, []);

  // ---------------------------
  // LOAD MESSAGES
  // ---------------------------
  useEffect(() => {
    if (!chatId) return;

    const unsub = subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsub && unsub();
  }, [chatId]);

  // Auto-scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  // ---------------------------
  // SEND MESSAGE
  // ---------------------------
  const handleSend = async () => {
    const messageText = text.trim();
    if (!messageText || !chatId) return;

    setText("");

    try {
      await sendMessage(chatId, messageText, "user");

      // Update chat timestamp so admin sees newest first
      await createOrEnsureChat(chatId, { updatedAt: new Date().toISOString() });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className={`chat-widget ${open ? "open" : ""}`}>
      {!open && (
        <button className="chat-toggle" onClick={() => setOpen(true)}>
          <span className="chat-icon-main">💬</span>
          <span className="chat-pulse"></span>
        </button>
      )}

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-status-indicator"></div>
              <div>
                <strong className="chat-title">Support Chat</strong>
                <div className="chat-sub">Messages to Admin</div>
              </div>
            </div>

            <button className="chat-close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="chat-messages" ref={messagesRef}>
            {messages.length === 0 ? (
              <div className="chat-empty-state">
                <div className="empty-icon">💬</div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`chat-message ${
                    m.sender === "admin" ? "admin" : "user"
                  }`}
                >
                  <div className="message-avatar">
                    {m.sender === "admin" ? "👨‍💼" : "👤"}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{m.text}</div>
                    <div className="message-meta">
                      {m.createdAt?.toDate
                        ? new Date(m.createdAt.toDate()).toLocaleTimeString()
                        : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              className="chat-send-btn"
              disabled={!text.trim()}
            >
              <span>Send</span>
              <span className="send-icon">➤</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
