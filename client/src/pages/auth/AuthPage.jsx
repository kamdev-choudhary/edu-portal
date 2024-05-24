import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const defaultTheme = createTheme();

export default function AuthPage() {
  const { storeTokenInLS } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    switch (name) {
      case "email":
        newErrors.email = value ? "" : "Email is required";
        break;
      case "password":
        newErrors.password = value ? "" : "Password is required";
        break;
      default:
        break;
    }

    setUser({ ...user, [name]: value });
    setErrors(newErrors);
    setLoginError("");
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    for (const key in user) {
      if (!user[key]) {
        isValid = false;
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      } else {
        newErrors[key] = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitUserLogin = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          const data = await response.json();
          storeTokenInLS(data.token);
          setUser({
            email: "",
            password: "",
          });
          navigate("/dashboard", { replace: true });
        } else {
          const errorMessage = await response.text();
          setLoginError(errorMessage);
        }
      } catch (error) {
        // Handle network errors
        console.error("Network error:", error);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          spacing={2}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmitUserLogin}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                value={user.email}
                onChange={handleInput}
                id="email"
                name="email"
                label="Email Address"
                error={Boolean(errors.email)}
                helperText={errors.email}
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={user.password}
                onChange={handleInput}
                error={Boolean(errors.password)}
                helperText={errors.password}
                id="password"
                name="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {Boolean(loginError) && (
                <Typography color="error" component="h2">
                  {loginError}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs={12} lg={12} md={12}>
                  <Link href="#" variant="body2">
                    <Button>Forgot password?</Button>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
