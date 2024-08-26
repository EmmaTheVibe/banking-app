import Greeting from "./Greeting";
import React, { useState } from "react";
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
  const [copied, setCopied] = useState(false);
  const closeCopied = () => {
    setCopied(false);
  };
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(loggedProfile.accountNumber)
      .then(() => {
        setCopied(true);
        setTimeout(closeCopied, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className={`home ${display === "home" ? "show" : ""}`}>
      <div className="info">
        <ProfilePicture
          loggedProfile={loggedProfile}
          handleClick={handleClick}
          pfpState={pfpState}
          size={100}
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
            , <span>{loggedProfile.firstname?.toUpperCase()}</span>
          </p>
        </div>
        <p onClick={copyToClipboard} style={{ position: "relative" }}>
          ACCOUNT NUMBER: <span>{loggedProfile.accountNumber}</span>{" "}
          {copied ? (
            <span
              style={{
                fontSize: "12px",
                position: "absolute",
                right: "-50px",
                top: "3px",
              }}
            >
              Copied
            </span>
          ) : (
            ""
          )}
        </p>
        <div className="balance-box">
          <p>
            BALANCE:{" "}
            <span>
              {loggedProfile.showBalance === true
                ? `N${formatNumber(loggedProfile.balance.toFixed(2))}`
                : "**********"}
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
