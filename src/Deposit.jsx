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
} from "./firebaseService";
import { formatNumber } from "./functions";

export default function Deposit({
  loggedProfile,
  setLoggedProfile,
  themeColors,
  setDisplay,
  pfpState,
}) {
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

  const limit = 99000000;

  const isBelowLimit = (amount) => {
    const total = Number(amount) + loggedProfile.balance;
    if (total < limit) {
      return true;
    } else {
      console.log(total);
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
        correct: (v) => {
          // if (v > 0) {
          //   return true;
          // } else {
          //   return "Please enter a valid amount";
          // }
          if (!isBelowLimit(v)) {
            return "Balance limit is N99,000,000";
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
      <p>
        Balance: <span>N{formatNumber(loggedProfile.balance.toFixed(2))}</span>
      </p>
      <form
        noValidate
        onSubmit={handleSubmitDeposit(handleDepositForm)}
        className="form"
      >
        <h2>Deposit</h2>
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
          <Button
            theme={themeColors}
            color="ochre"
            onClick={() => setDisplay("home")}
            variant="outlined"
            sx={{ fontFamily: "Kanit" }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
