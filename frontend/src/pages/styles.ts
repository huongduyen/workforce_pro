import { Card, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: theme.spacing(2),
  overflow: "hidden",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  width: "100%",
  padding: theme.spacing(2),
}));
