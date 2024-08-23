import Greeting from "./Greeting";
import React from "react";
import { IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";
import { formatNumber } from "./functions";
import { updateBalanceVisibility } from "./firebaseService";
import DepositCard from "./DepositCard";
import TransferCard from "./TransferCard";
import HistoryCard from "./HistoryCard";
import { fetchUserTransactions } from "./firebaseService";
import ProfilePicture from "./Profilepicture";

export default function Home({
  loggedProfile,
  pfpState,
  setLoggedProfile,
  display,
  setDisplay,
  setLoadingHistory,
  setTransactionHistory,
}) {
  const handleTransactions = async () => {
    setDisplay("transactions");
    setLoadingHistory(true);
    const transactionData = await fetchUserTransactions(loggedProfile.id);
    setLoadingHistory(false);
    setTransactionHistory(transactionData);
  };

  const handleClickShowBalance = async () => {
    setLoggedProfile({
      ...loggedProfile,
      showBalance: !loggedProfile.showBalance,
    });
    const visibility = !loggedProfile.showBalance;
    console.log(visibility);
    await updateBalanceVisibility(loggedProfile.id, visibility);
    if (updateBalanceVisibility(loggedProfile.id, visibility) === false) {
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={`home ${display === "home" ? "show" : ""}`}>
      <div className="info">
        <ProfilePicture
          loggedProfile={loggedProfile}
          handleClick={handleClick}
          pfpState={pfpState}
          size={150}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          sx={{ marginLeft: "10px" }}
        >
          <div className="change" onClick={() => setDisplay("pfp")}>
            <p>Change</p>
          </div>
        </Popover>

        <div className="span">
          <Greeting />
          <p>
            , <span>{loggedProfile.firstname}.</span>
          </p>
        </div>
        <p>
          Account number: <span>{loggedProfile.accountNumber}</span>
        </p>
        <div className="balance-box">
          <p>
            Balance:{" "}
            <span>
              {loggedProfile.showBalance === true
                ? `N${formatNumber(loggedProfile.balance.toFixed(2))}`
                : "********"}
            </span>
          </p>
          <IconButton
            sx={{ color: "#d59bf6" }}
            aria-label="toggle password visibility"
            onClick={() => handleClickShowBalance()}
            edge="end"
          >
            {loggedProfile.showBalance === true ? (
              <VisibilityOff />
            ) : (
              <Visibility />
            )}
          </IconButton>
        </div>
      </div>
      <div className="utils">
        <DepositCard setDisplay={setDisplay} />
        <TransferCard setDisplay={setDisplay} />
        <HistoryCard
          setDisplay={setDisplay}
          handleTransactions={handleTransactions}
        />
      </div>
    </div>
  );
}
