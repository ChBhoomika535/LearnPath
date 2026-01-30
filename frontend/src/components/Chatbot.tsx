import React, { useState, useEffect } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Call Gemini API with key from .env
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }]}],
          }),
        }
      );
      const data = await response.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn’t find an answer.";

      const botMessage: Message = { sender: "bot", text: botReply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: Message = {
        sender: "bot",
        text: "Error connecting to Gemini API.",
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput("");
  };

  // Clear chat history
  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div>
      {/* Floating bubble toggle */}
      <div style={styles.bubble} onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div style={styles.chatContainer}>
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(msg.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage),
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
              placeholder="Ask for study tips..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} style={styles.button}>
              Send
            </button>
            <button onClick={handleClear} style={styles.clearButton}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles: { [key: string]: React.CSSProperties } = {
  bubble: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#007BFF",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    fontSize: "24px",
  },
  chatContainer: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "350px",
    height: "450px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
  },
  message: {
    margin: "5px 0",
    padding: "8px 12px",
    borderRadius: "16px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "8px",
  },
  button: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
    cursor: "pointer",
    marginRight: "5px",
  },
  clearButton: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "white",
    cursor: "pointer",
  },
};

export default Chatbot;
