import { useState, useRef, useEffect } from "react";
import { TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import BeneficiaryList from "./BeneficiaryList";
import ProfilePicture from "./Profilepicture";
import Switch from "@mui/material/Switch";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { formatNumber } from "./functions";
import {
  logTransferTransaction,
  fetchUserTransactions,
  addBeneficiary,
  isAccountNumberInBeneficiaryList,
  fetchBeneficiaryList,
} from "./firebaseService";
import { alpha, styled } from "@mui/material/styles";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#d59bf6",
    "&:hover": {
      backgroundColor: alpha("#d59bf6", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#d59bf6",
  },
}));

export default function Transfer({
  loggedProfile,
  setLoggedProfile,
  themeColors,
  setDisplay,
  pfpState,
}) {
  const [loading, setLoading] = useState(false);
  const isButtonDisabled = loading === true;

  const [recipientName, setRecipientName] = useState("");
  // const [recipientAccountNumber, setRecipientAccountNumber] = useState("");

  const [loadBeneficiaries, setLoadBeneficiaries] = useState(false);
  const [beneficiaryList, setBeneficiaryList] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const formRef = useRef(null);
  useEffect(() => {
    if (isListVisible && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isListVisible]);

  const [isBeneficiary, setIsBeneficiary] = useState(false);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);

  const handleSwitchChange = (event) => {
    setSaveBeneficiary(event.target.checked); // Update state based on switch status
  };

  const {
    control,
    trigger,
    register: registerTransfer,
    handleSubmit: handleSubmitTransfer,
    reset: resetTransfer,
    formState: { errors: transferErrors },
    setValue,
  } = useForm({ mode: "onChange" });

  const [snackbar, setSnackbar] = React.useState({
    openBar: false,
    vertical: "top",
    horizontal: "center",
  });
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, openBar: false });
  };
  const { vertical, horizontal, openBar } = snackbar;

  // const handleAccNoChange = (event) => {
  //   setRecipientAccountNumber(event.target.value);
  // };

  const checkAccountName = async (data) => {
    const accountNumber = data.toString();
    if (accountNumber) {
      const profilesRef = collection(db, "profiles");
      const recipientQuery = query(
        profilesRef,
        where("accountNumber", "==", accountNumber)
      );
      const recipientSnap = await getDocs(recipientQuery);

      const recipientDoc = recipientSnap.docs[0];
      if (recipientSnap.empty) {
        setRecipientName("");
        setValue("accountName", "");
        return;
      } else {
        const recipientData = recipientDoc.data();
        setRecipientName(
          `${recipientData.lastname} ${recipientData.firstname}`
        );
        setValue(
          "accountName",
          `${recipientData.lastname} ${recipientData.firstname}`
        );
      }
      const isAdded = await isAccountNumberInBeneficiaryList(
        loggedProfile.id,
        accountNumber
      );
      setIsBeneficiary(isAdded);
    } else {
      setRecipientName("");
      setValue("accountName", "");
    }
  };

  const handleLoadBeneficiaries = async () => {
    setIsListVisible(true);
    const beneficiaries = await fetchBeneficiaryList(loggedProfile.id);
    setBeneficiaryList(beneficiaries);
    console.log(beneficiaryList);
  };

  const handleTransfer = async (data) => {
    setLoading(true);
    const transferAmount = parseFloat(data.amount);
    const transferDestination = data.accountNumber.toString();

    try {
      const senderRef = doc(db, "profiles", loggedProfile.id);
      const senderSnap = await getDoc(senderRef);

      if (!senderSnap.exists()) {
        console.log("Sender profile does not exist");
        return;
      }

      const senderData = senderSnap.data();

      const profilesRef = collection(db, "profiles");
      const recipientQuery = query(
        profilesRef,
        where("accountNumber", "==", transferDestination)
      );
      const recipientSnap = await getDocs(recipientQuery);

      if (recipientSnap.empty) {
        console.log("Recipient account does not exist");
        return;
      }

      const recipientDoc = recipientSnap.docs[0];
      const recipientRef = doc(db, "profiles", recipientDoc.id);
      const recipientData = recipientDoc.data();

      const senderBalance = senderData.balance - transferAmount;
      await updateDoc(senderRef, {
        balance: senderBalance,
      });
      await updateDoc(recipientRef, {
        balance: recipientData.balance + transferAmount,
      });
      await logTransferTransaction(
        loggedProfile.id,
        loggedProfile.firstname,
        loggedProfile.lastname,
        recipientDoc.id,
        recipientData.firstname,
        recipientData.lastname,
        transferAmount
      );
      if (saveBeneficiary) {
        await addBeneficiary(
          loggedProfile.id,
          recipientData.accountNumber,
          recipientData.firstname,
          recipientData.lastname,
          recipientData.imageUrl
        );
      }
      const transactionData = await fetchUserTransactions(loggedProfile.id);
      console.log(transactionData);

      setLoggedProfile({ ...loggedProfile, balance: senderBalance });
      setLoading(false);
      setSaveBeneficiary(false);
      setSnackbar({ ...snackbar, openBar: true });
    } catch (error) {
      console.error("Error during transfer:", error);
    }
  };

  const handleTransferForm = async (formData) => {
    await handleTransfer(formData);
    setRecipientName("");
    setValue("accountName", "");
    resetTransfer();
  };

  const checkBalance = (data) => {
    if (Number(data) > loggedProfile.balance) {
      return false;
    } else {
      return true;
    }
  };

  const checkVal = (data) => {
    if (Number(data) > 0) {
      return true;
    } else {
      return false;
    }
  };

  const checkAccNo = (data) => {
    if (data === loggedProfile.accountNumber) {
      return false;
    } else {
      return true;
    }
  };

  const registerTransferOptions = {
    accountNumber: {
      required: "Please enter an account number",
      validate: {
        correct: async (v) => {
          if (checkAccNo(v)) {
            await checkAccountName(v);
            return true;
          } else {
            setRecipientName("");
            setValue("accountName", "");
            return "You think say you wise lol";
          }
        },
      },
    },
    amount: {
      required: "Please enter an amount",
      validate: {
        correct: (v) => {
          // if (checkBalance(v)) {
          //   return true;
          // } else if (!checkBalance(v)) {
          //   return "Insufficient Balance";
          // } else if (checkVal(v)) {
          //   return true;
          // } else if (!checkVal(v)) {
          //   return "Please enter a valid amount";
          // }
          if (!checkBalance(v)) {
            return "Insufficient Balance";
          } else if (!checkVal(v)) {
            return "Please enter a valid amount";
          } else {
            return true;
          }
        },
      },
    },
  };

  return (
    <div className="transfer">
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

      <h2>Transfer</h2>
      <form
        className="form"
        noValidate
        onSubmit={handleSubmitTransfer(handleTransferForm)}
      >
        <div className="top">
          <h5 onClick={handleLoadBeneficiaries} className="beneficiary-display">
            Select beneficiary
          </h5>
        </div>
        <div className="label">
          <Controller
            name="accountNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                className="custom-text-field"
                placeholder="Enter the recepient's account number"
                label="Account number"
                name="accountNumber"
                variant="standard"
                fullWidth
                type="number"
                // value={recipientAccountNumber}
                // onChange={(e) => handleAccNoChange(e)}
                {...registerTransfer(
                  "accountNumber",
                  registerTransferOptions.accountNumber
                )}
                helperText={
                  transferErrors?.accountNumber && (
                    <span className="error">
                      {transferErrors.accountNumber.message}
                    </span>
                  )
                }
              />
            )}
          />
          {/* <TextField
            className="custom-text-field"
            placeholder="Enter the recepient's account number"
            label="Account number"
            name="accountNumber"
            variant="standard"
            fullWidth
            type="number"
            value={recipientAccountNumber}
            onChange={(e) => handleAccNoChange(e)}
            {...registerTransfer(
              "accountNumber",
              registerTransferOptions.accountNumber
            )}
            helperText={
              transferErrors?.accountNumber && (
                <span className="error">
                  {transferErrors.accountNumber.message}
                </span>
              )
            }
          /> */}
        </div>
        <div className="label">
          <TextField
            disabled
            className="custom-text-field"
            label="Account name"
            name="accountName"
            variant="standard"
            fullWidth
            value={recipientName}
            // InputProps={{
            //   readOnly: true,
            // }}
            sx={{
              "& .Mui-disabled": {
                color: "#eee", // Change the text color when disabled
                borderColor: "red", // Change the border color when disabled
              },
            }}
          />
        </div>
        <div className="label">
          <TextField
            className="custom-text-field"
            placeholder="Enter an amount to transfer"
            label="Amount"
            name="transfer"
            variant="standard"
            fullWidth
            type="number"
            {...registerTransfer("amount", registerTransferOptions.amount)}
            helperText={
              transferErrors?.amount && (
                <span className="error">{transferErrors.amount.message}</span>
              )
            }
          />
        </div>
        {!isBeneficiary ? (
          <div className="addBeneficiary">
            <h4>
              Save as beneficiary?{" "}
              <PinkSwitch
                checked={saveBeneficiary}
                onChange={handleSwitchChange}
              />
            </h4>
          </div>
        ) : (
          ""
        )}
        <div className="buttons">
          <Button
            theme={themeColors}
            color="ochre"
            type="submit"
            variant="contained"
            sx={{ fontFamily: "Kanit" }}
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
              "Transfer"
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
      {isListVisible && (
        <BeneficiaryList
          setIsListVisible={setIsListVisible}
          formRef={formRef}
          beneficiaryList={beneficiaryList}
          setBeneficiaryList={setBeneficiaryList}
          setValue={setValue}
          trigger={trigger}
          loggedProfile={loggedProfile}
        />
      )}
    </div>
  );
}
