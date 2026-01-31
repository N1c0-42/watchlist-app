export default function Toast({ message, type, actionLabel, onAction }) {
  const bg = type === "error" ? "#7f1d1d" : "#064e3b";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: bg,
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 8,
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        zIndex: 1000,
        fontSize: 14,
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <span>{message}</span>

      {actionLabel && (
        <button
          onClick={onAction}
          style={{
            background: "transparent",
            border: "none",
            color: "#a7f3d0",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
