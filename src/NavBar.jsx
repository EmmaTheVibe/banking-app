import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import ModalBox from "./ModalBox";
import { Button } from "@mui/material";

export default function NavBar({
  themeColors,
  setShowLogin,
  setLoggedProfile,
}) {
  const [openModal, setOpenModal] = useState(false);
  const handleLogout = () => {
    setOpenModal(false);
    setShowLogin("login");
    setLoggedProfile({
      accountNumber: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      balance: 0,
      imageUrl: "",
      showPassword: true,
    });
  };
  return (
    <>
      <ModalBox openModal={openModal}>
        <div className="benef-modal">
          <p
            style={{ fontSize: "20px", marginBottom: "16px", color: "#d59bf6" }}
          >
            LOG OUT?
          </p>

          <div
            className="beneficiary-top"
            style={{
              padding: "0px 18px",
              marginBottom: "6px",
              marginTop: "12px",
            }}
          >
            <Button
              theme={themeColors}
              color="ochre"
              type="submit"
              variant="outlined"
              sx={{ fontFamily: "Kanit" }}
              onClick={() => setOpenModal(false)}
              style={{ cursor: "pointer" }}
            >
              No
            </Button>
            <Button
              theme={themeColors}
              color="ochre"
              type="submit"
              variant="contained"
              sx={{ fontFamily: "Kanit" }}
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Yes
            </Button>
          </div>
        </div>
      </ModalBox>
      <div className="navbar">
        <div className="nav-items">
          <h2 style={{ color: "#eee" }}>The Bank</h2>
          <LogoutIcon
            sx={{ color: "#d59bf6", cursor: "pointer" }}
            onClick={() => setOpenModal(true)}
          />
        </div>
      </div>
    </>
  );
}
