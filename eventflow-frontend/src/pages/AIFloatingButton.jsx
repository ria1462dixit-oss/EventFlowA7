export default function AIFloatingButton() {
  return (
    <a
      href="https://ai-chatbot-eventsystem.zapier.app/"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with AI Assistant"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(124,58,237,0.45)",
        zIndex: 999,
        textDecoration: "none",
        fontSize: "24px",
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      🤖
    </a>
  );
}
