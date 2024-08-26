import { useState } from "react";
import * as React from "react";
import "./App.css";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { KeyboardArrowRight } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { findProfileInFirestore } from "./firebaseService";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function LoginForm({
  themeColors,
  setShowLogin,
  loggedProfile,
  setLoggedProfile,
  pfpState,
  setPfpState,
}) {
  const matches = useMediaQuery("(max-width:650px)");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [invalidAlert, setInvalidAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleLogin = async (item) => {
    setLoading(true);
    setInvalidAlert(false);
    const profile = await findProfileInFirestore(item.email, item.password);
    if (profile) {
      profile.imageUrl.length > 1 && setPfpState(true);
      setLoggedProfile({
        accountNumber: profile.accountNumber,
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        balance: profile.balance,
        password: profile.password,
        id: profile.id,
        imageUrl: profile.imageUrl,
        showBalance: profile.showBalance,
      });
      console.log(loggedProfile);
      setLoading(false);
      setShowLogin("profile");
    } else {
      setLoading(false);
      setInvalidAlert(true);
      setAlertText("Invalid username or password!");
    }
  };

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: { errors: loginErrors },
  } = useForm({ mode: "onChange" });

  const handleLoginForm = async (formData) => {
    await handleLogin(formData);
    resetLogin();
  };

  const registerLoginOptions = {
    email: {
      required: "Please enter your email",
    },
    password: {
      required: "Please input your password",
    },
  };

  return (
    <div className="login">
      {invalidAlert && (
        <Alert
          variant="filled"
          severity="error"
          sx={{ marginBottom: "15px", fontFamily: "Kanit" }}
          className="alert"
        >
          {alertText}
        </Alert>
      )}
      <form
        className="form"
        noValidate
        onSubmit={handleSubmitLogin(handleLoginForm)}
      >
        <p
          style={{
            fontSize: `${matches ? "20px" : "26px"}`,
            color: "#d59bf6",
          }}
        >
          LOGIN
        </p>
        <div className="label">
          <TextField
            className="custom-text-field"
            placeholder="Enter your email"
            label="Email"
            name="email"
            variant="standard"
            fullWidth
            type="mail"
            {...registerLogin("email", registerLoginOptions.email)}
            helperText={
              loginErrors?.email && (
                <span className="error">{loginErrors.email.message}</span>
              )
            }
          />
        </div>

        <div className="label">
          <TextField
            className="custom-text-field"
            type={showPassword ? "text" : "password"}
            name="password"
            fullWidth
            variant="standard"
            {...registerLogin("password", registerLoginOptions.password)}
            helperText={
              loginErrors?.password && (
                <span className="error">{loginErrors.password.message}</span>
              )
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: "#d59bf6" }}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Password"
          />
        </div>
        <div className="buttons">
          <Button
            theme={themeColors}
            color="ochre"
            type="submit"
            variant="contained"
            sx={{ fontFamily: "Kanit" }}
            endIcon={<KeyboardArrowRight sx={{ color: "#141010" }} />}
          >
            {loading ? (
              <CircularProgress
                style={{ color: "#141010", width: "15px", height: "15px" }}
              />
            ) : (
              "Login"
            )}
          </Button>
          <Button
            theme={themeColors}
            color="ochre"
            onClick={() => setShowLogin("signUp")}
            variant="outlined"
            sx={{ fontFamily: "Kanit" }}
            startIcon={<KeyboardArrowLeft />}
          >
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
}
