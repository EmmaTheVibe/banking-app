import { useState, useEffect } from "react";
import "./App.css";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { KeyboardArrowRight } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import {
  addProfileToFirestore,
  getProfilesFromFirestore,
  isEmailRegistered,
} from "./firebaseService";
import emailjs from "emailjs-com";
import { createTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
const theme = createTheme({
  palette: {
    ochre: {
      main: "#d59bf6",
      // light: '#E9DB5D',
      // dark: '#A29415',
      contrastText: "#242105",
    },
    // formInput{
    //   main:
    // }
  },
});
const generatedAccNos = new Set();

const generateAcctNo = () => {
  let tenDigitNumber;

  // Continue generating numbers until a unique one is found
  do {
    tenDigitNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
  } while (generatedAccNos.has(tenDigitNumber));

  // Add the unique number to the set
  generatedAccNos.add(tenDigitNumber);

  return tenDigitNumber;
};

export default function SignUpForm({ setShowLogin }) {
  const [loading, setLoading] = useState(false);
  let newProfile = {
    accountNumber: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    balance: 0,
    imageUrl: "",
  };
  const [profiles, setProfiles] = useState([]);
  const addProfile = async ({
    firstname,
    lastname,
    email,
    password,
    imageUrl,
  }) => {
    newProfile = {
      accountNumber: generateAcctNo(),
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      balance: 0,
      imageUrl: "",
      showBalance: true,
    };
    await addProfileToFirestore(newProfile);
    setProfiles([...profiles, newProfile]);
    console.log(newProfile);
  };
  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await getProfilesFromFirestore();
      setProfiles(profiles);
    };
    fetchProfiles();
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [hasSigned, setHasSigned] = useState(false);

  const handleRegistration = async (formData) => {
    setLoading(true);
    try {
      const emailExists = await isEmailRegistered(formData.email);
      if (emailExists) {
        console.error("Email is already registered.");
        return;
      }
      await addProfile(formData);
      const templateParams = {
        firstname: formData.firstname,
        email: formData.email,
        accountNumber: newProfile.accountNumber,
      };
      setLoading(false);
      emailjs
        .send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          templateParams,
          process.env.REACT_APP_EMAILJS_USER_ID
        )
        .then(
          (result) => {
            console.log("Email sent successfully:", result.text);
            console.log("Email sent successfully to:", templateParams.email);
          },
          (error) => {
            console.log("Email send error:", error.text);
            console.log(
              "Service Id:",
              process.env.REACT_APP_EMAILJS_SERVICE_ID
            );
            console.log("User Id:", process.env.REACT_APP_EMAILJS_USER_ID);
          }
        );
      setShowLogin("login");
      setHasSigned(!hasSigned);
      console.log(hasSigned);
      const form = document.querySelector(".form");
      form.style.display = "none";
      reset();
      console.log("Signup successful!");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  const handleError = (errors) => {};
  const registerOptions = {
    firstname: { required: "Name cannot be blank" },
    lastname: { required: "Name cannot be blank" },
    email: { required: "Email cannot be blank" },
    password: {
      required: "Password is required",
      pattern: {
        // value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        value: /[A-Za-z]{4}/,
        message: "Password must be exacty 4 letters",
        // message:
        //   "Password must be 8 characters long and must contain at least one number and one uppercase letter",
      },
    },
    confPassword: {
      required: "Please confirm your password",
      validate: (val) => {
        if (watch("password") !== val) {
          return "Your passwords do no match";
        }
      },
    },
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [showConfPassword, setShowConfPassword] = useState(false);
  const handleClickShowConfPassword = () =>
    setShowConfPassword((show) => !show);
  // const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="sign-up">
      <form
        className="form"
        noValidate
        onSubmit={handleSubmit(handleRegistration, handleError)}
      >
        <h2>Sign up</h2>

        <div className="label">
          <TextField
            className="custom-text-field"
            placeholder="Enter your first name"
            label="First name"
            name="firstname"
            variant="standard"
            fullWidth
            {...register("firstname", registerOptions.firstname)}
            helperText={
              errors?.firstname && (
                <span className="error">{errors.firstname.message}</span>
              )
            }
          />
        </div>

        <div className="label">
          <TextField
            className="custom-text-field"
            placeholder="Enter your last name"
            label="Last name"
            name="lastname"
            variant="standard"
            fullWidth
            sx={{ fontFamily: "Kanit" }}
            {...register("lastname", registerOptions.lastname)}
            helperText={
              errors?.lastname && (
                <span className="error">{errors.lastname.message}</span>
              )
            }
          />
        </div>

        <div className="label">
          <TextField
            className="custom-text-field"
            placeholder="Enter your email"
            label="Email"
            name="email"
            variant="standard"
            fullWidth
            type="mail"
            sx={{ fontFamily: "Kanit" }}
            {...register("email", registerOptions.email)}
            helperText={
              errors?.email && (
                <span className="error">{errors.email.message}</span>
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
            {...register("password", registerOptions.password)}
            helperText={
              errors?.password && (
                <span className="error">{errors.password.message}</span>
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

        <div className="label">
          <TextField
            className="custom-text-field"
            type={showConfPassword ? "text" : "password"}
            name="confPassword"
            fullWidth
            variant="standard"
            {...register("confPassword", registerOptions.confPassword)}
            helperText={
              errors?.confPassword && (
                <span className="error">{errors.confPassword.message}</span>
              )
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: "#d59bf6" }}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfPassword}
                    edge="end"
                  >
                    {showConfPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Confirm password"
          />
        </div>
        <div className="buttons">
          <Button
            theme={theme}
            type="submit"
            variant="contained"
            color="ochre"
            sx={{ fontFamily: "Kanit" }}
            endIcon={<KeyboardArrowRight sx={{ color: "#141010" }} />}
          >
            {loading ? (
              <CircularProgress
                style={{
                  color: "#ffffff",
                  width: "15px",
                  height: "15px",
                }}
              />
            ) : (
              "Sign up"
            )}
          </Button>
          <Button
            theme={theme}
            onClick={() => setShowLogin("login")}
            variant="outlined"
            color="ochre"
            sx={{ fontFamily: "Kanit" }}
            endIcon={<KeyboardArrowRight />}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
