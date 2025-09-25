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
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import { AuthActionType } from "../../contexts/auth/AuthContext";
import { loginSchema } from "./helpers";
import { StyledCard, StyledContainer } from "../styles";

type LoginFormData = yup.InferType<typeof loginSchema>;

interface LoginProps {
  onToggleToSignup?: () => void;
}

export const Login = ({ onToggleToSignup }: LoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await userService.login(data);
      dispatch({
        type: AuthActionType.LOGIN,
        payload: { user: response.user },
      });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
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
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please sign in to your account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              {...form.register("email")}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              {...form.register("password")}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
              disabled={isLoading}
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
                "Sign In"
              )}
            </Button>
          </Box>

          {/* Toggle to Signup */}
          {onToggleToSignup && (
            <Box
              textAlign="center"
              mt={2}
              pt={2}
              borderTop="1px solid"
              borderColor="divider"
            >
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={onToggleToSignup}
                  sx={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          )}
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
};
