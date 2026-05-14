/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userService } from "../../services/userService";
import { signupSchema } from "./helpers";
import { StyledCard, StyledContainer } from "../styles";

type SignupFormData = yup.InferType<typeof signupSchema>;

interface SignupProps {
  onToggleToLogin?: () => void;
}

export const Signup = ({ onToggleToLogin }: SignupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const { dispatch } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Only send email and password to the service
      const { confirmPassword, ...signupData } = data;
      await userService.register(signupData);
      setSuccess(true);
      form.reset();
      // Redirect to login after 2 seconds
      setTimeout(() => {
        if (onToggleToLogin) {
          onToggleToLogin();
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth={false}>
      <StyledCard elevation={8}>
        <CardContent>
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={600}
            >
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign up to get started
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account created successfully! Redirecting to login...
            </Alert>
          )}

          {/* Signup Form */}
          <Box
            component="form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              {...form.register("email")}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              {...form.register("confirmPassword")}
              error={!!form.formState.errors.confirmPassword}
              helperText={form.formState.errors.confirmPassword?.message}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>

          {/* Toggle to Login */}
          {onToggleToLogin && (
            <Box
              textAlign="center"
              mt={2}
              pt={2}
              borderTop="1px solid"
              borderColor="divider"
            >
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={onToggleToLogin}
                  sx={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          )}
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
};
