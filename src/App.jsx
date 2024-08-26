import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import "./App.css";
import { useState } from "react";
import { createTheme } from "@mui/material/styles";
import Profile from "./Profile";
import Home from "./Home";
import Deposit from "./Deposit";
import Transfer from "./Transfer";
import ImageUpload from "./ImageUpload";
import TransactionHistory from "./TransactionHistory";

import NavBar from "./NavBar";

const theme = createTheme({
  palette: {
    ochre: {
      main: "#d59bf6",
      contrastText: "#242105",
    },
    gray: { main: "#eee" },
  },
});

function App() {
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [showLogin, setShowLogin] = useState("signUp");

  const [loggedProfile, setLoggedProfile] = useState({
    accountNumber: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    balance: 0,
    imageUrl: "",
    showPassword: true,
  });
  const [transactionHistory, setTransactionHistory] = useState([]);

  const [display, setDisplay] = useState("home");
  const [pfpState, setPfpState] = useState(false);

  return (
    // <ModalBox />
    <main className="app">
      {showLogin === "login" ? (
        <LoginForm
          themeColors={theme}
          setShowLogin={setShowLogin}
          loggedProfile={loggedProfile}
          setLoggedProfile={setLoggedProfile}
          pfpState={pfpState}
          setPfpState={setPfpState}
          setDisplay={setDisplay}
        />
      ) : showLogin === "signUp" ? (
        <SignUpForm
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          theme={theme}
        />
      ) : showLogin === "profile" ? (
        <>
          <NavBar
            themeColors={theme}
            setShowLogin={setShowLogin}
            setLoggedProfile={setLoggedProfile}
            loggedProfile={loggedProfile}
          />
          <Profile
            setDisplay={setDisplay}
            setTransactionHistory={setTransactionHistory}
            loggedProfile={loggedProfile}
          >
            {display === "home" && (
              <Home
                loggedProfile={loggedProfile}
                pfpState={pfpState}
                setLoggedProfile={setLoggedProfile}
                display={display}
                setDisplay={setDisplay}
                setLoadingHistory={setLoadingHistory}
                setTransactionHistory={setTransactionHistory}
              />
            )}
            {display === "deposit" && (
              <Deposit
                pfpState={pfpState}
                loggedProfile={loggedProfile}
                setLoggedProfile={setLoggedProfile}
                themeColors={theme}
                setDisplay={setDisplay}
                setTransactionHistory={setTransactionHistory}
              />
            )}
            {display === "transfer" && (
              <Transfer
                pfpState={pfpState}
                loggedProfile={loggedProfile}
                setLoggedProfile={setLoggedProfile}
                themeColors={theme}
                setTransactionHistory={setTransactionHistory}
                setDisplay={setDisplay}
              />
            )}
            {display === "pfp" && (
              <ImageUpload
                loggedProfile={loggedProfile}
                setLoggedProfile={setLoggedProfile}
                themeColors={theme}
                pfpState={pfpState}
                setPfpState={setPfpState}
                setDisplay={setDisplay}
              />
            )}
            {display === "transactions" && loadingHistory ? (
              <p>Loading...</p>
            ) : display === "transactions" && !loadingHistory ? (
              <TransactionHistory
                loggedProfile={loggedProfile}
                themeColors={theme}
                transactionHistory={transactionHistory}
                setDisplay={setDisplay}
                pfpState={pfpState}
              />
            ) : (
              ""
            )}
            {/* {display === "beneficiaries" && loadingBeneficiaries ? (
            <p>Loading...</p>
          ) : display === "beneficiaries" && !loadingBeneficiaries ? (
            <BeneficiaryList
              loggedProfile={loggedProfile}
              themeColors={theme}
              beneficiaryList={beneficiaryList}
              setDisplay={setDisplay}
              pfpState={pfpState}
            />
          ) : (
            ""
          )} */}
          </Profile>
        </>
      ) : (
        ""
      )}
    </main>
  );
}

export default App;
