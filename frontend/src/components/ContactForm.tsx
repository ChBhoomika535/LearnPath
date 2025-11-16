import React, { useState } from "react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks ${formData.name}! We'll reply to your query soon 💌`);
    setFormData({ name: "", email: "", query: "" });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📬 Contact Us</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="query"
          placeholder="Your Query..."
          value={formData.query}
          onChange={handleChange}
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.button}>
          ✨ Send
        </button>
      </form>
    </div>
  );
};

// Bigger, bolder styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#333",
    fontSize: "2rem", // bigger title
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px", // more spacing
  },
  input: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "1.2rem", // bigger font
    transition: "all 0.3s ease",
  },
  textarea: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "1.2rem", // bigger font
    minHeight: "120px",
    resize: "none",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#ff6f61",
    color: "white",
    fontSize: "1.3rem", // bigger button text
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default ContactForm;
