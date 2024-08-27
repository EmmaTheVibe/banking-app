import { TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ProfilePicture from "./Profilepicture";
import {
  updateBalanceInFirestore,
  logDepositTransaction,
  fetchUserTransactions,
} from "../firebase/firebaseService";
import { formatNumber } from "../utils/functions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { refreshAccount } from "../firebase/firebaseService";

export default function Deposit({
  loggedProfile,
  setLoggedProfile,
  themeColors,
  setDisplay,
  pfpState,
}) {
  const matches = useMediaQuery("(max-width:650px)");

  const [loading, setLoading] = useState(false);
  const isButtonDisabled = loading === true;
  const [snackbar, setSnackbar] = React.useState({
    openBar: false,
    vertical: "top",
    horizontal: "center",
  });
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, openBar: false });
  };
  const { vertical, horizontal, openBar } = snackbar;

  const handleDeposit = async (depositAmount) => {
    setLoading(true);

    const newBalance = loggedProfile.balance + parseFloat(depositAmount);
    await updateBalanceInFirestore(loggedProfile.id, newBalance);
    if (updateBalanceInFirestore(loggedProfile.id, newBalance) === false) {
    }

    await logDepositTransaction(loggedProfile.id, parseFloat(depositAmount));
    const transactionData = await fetchUserTransactions(loggedProfile.id);

    setSnackbar({ ...snackbar, openBar: true });
    setLoading(false);
    setLoggedProfile({ ...loggedProfile, balance: newBalance });
    console.log(transactionData);
  };
  const handleDepositForm = async (formData) => {
    await handleDeposit(formData.amount);
    resetDeposit();
  };

  const limit = 500000000;

  const isBelowLimit = async (amount) => {
    const profile = await refreshAccount(loggedProfile.accountNumber);
    const total = Number(amount) + profile.balance;
    if (total < limit) {
      return true;
    } else {
      return false;
    }
  };
  const checkNegative = (amount) => {
    if (Number(amount) > 0) {
      return true;
    } else {
      return false;
    }
  };
  const registerDepositOptions = {
    amount: {
      required: "Please enter an amount",
      validate: {
        correct: async (v) => {
          const isBelow = await isBelowLimit(v);
          if (!isBelow) {
            return "Balance limit is N500,000,000";
          } else if (!checkNegative(v)) {
            return "Please enter a valid amount";
          } else {
            return true;
          }
        },
      },
    },
  };
  const {
    register: registerDeposit,
    handleSubmit: handleSubmitDeposit,
    reset: resetDeposit,
    formState: { errors: depositErrors },
  } = useForm({ mode: "onChange" });

  return (
    <div className="deposit">
      <div className="success">
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openBar}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          key={vertical + horizontal}
          className="custom-snackbar"
        >
          <Alert severity="success" sx={{ width: "100%", fontFamily: "Kanit" }}>
            Transaction succesful!
          </Alert>
        </Snackbar>
      </div>
      <ProfilePicture loggedProfile={loggedProfile} pfpState={pfpState} />
      <p style={{ margin: "14px 0px" }}>
        BALANCE: <span>N{formatNumber(loggedProfile.balance.toFixed(2))}</span>
      </p>
      <form
        noValidate
        onSubmit={handleSubmitDeposit(handleDepositForm)}
        className="form"
      >
        <p
          style={{ fontSize: `${matches ? "20px" : "26px"}`, color: "#d59bf6" }}
        >
          DEPOSIT
        </p>
        <div className="label">
          <TextField
            className="custom-text-field"
            placeholder="Enter an amount to deposit"
            label="Amount"
            name="deposit"
            variant="standard"
            fullWidth
            type="number"
            {...registerDeposit("amount", registerDepositOptions.amount)}
            helperText={
              depositErrors?.amount && (
                <span className="error">{depositErrors.amount.message}</span>
              )
            }
          />
        </div>
        <div className="buttons">
          <Button
            theme={themeColors}
            color="ochre"
            onClick={() => setDisplay("home")}
            variant="outlined"
            sx={{ fontFamily: "Kanit" }}
          >
            Cancel
          </Button>
          <Button
            theme={themeColors}
            sx={{ fontFamily: "Kanit" }}
            color="ochre"
            type="submit"
            variant="contained"
            disabled={isButtonDisabled}
          >
            {loading ? (
              <CircularProgress
                style={{
                  color: "#141010",
                  width: "15px",
                  height: "15px",
                }}
              />
            ) : (
              "Deposit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
