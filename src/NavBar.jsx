import LogoutIcon from "@mui/icons-material/Logout";
export default function NavBar() {
  return (
    <div className="navbar">
      <div className="nav-items">
        <h2 style={{ color: "#eee" }}>The Bank</h2>
        <LogoutIcon sx={{ color: "#d59bf6", cursor: "pointer" }} />
      </div>
    </div>
  );
}
