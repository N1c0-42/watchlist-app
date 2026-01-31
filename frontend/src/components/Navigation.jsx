import { NavLink } from "react-router-dom";

function Navigation() {
  const linkStyle = ({ isActive }) => ({
    marginRight: "16px",
    textDecoration: "none",
    color: isActive ? "#ffffff" : "#aaaaaa",
    fontWeight: isActive ? "bold" : "normal",
    borderBottom: isActive ? "2px solid #2f80ed" : "none",
    paddingBottom: "4px",
  });

  return (
    <header
      style={{
        width: "100%",
        borderBottom: "1px solid #2a2a2a",
        marginBottom: "24px",
      }}
    >
      {/* 👇 Header-Innencontainer */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <nav>
          <NavLink to="/" style={linkStyle}>
            🎬 Meine Watchlist
          </NavLink>

          <NavLink to="/add" style={linkStyle}>
            ➕ Neuer Eintrag
          </NavLink>

          <NavLink to="/services" style={linkStyle}>
            📺 Meine Dienste
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
