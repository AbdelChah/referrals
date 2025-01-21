import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  padding: "24px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

export const DetailsList = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
}));

export const DetailsItem = styled("div")(({ theme }) => ({
  fontSize: "1rem",
  lineHeight: "1.5",
  color: theme.palette.text.primary,
  "& strong": {
    color: theme.palette.text.secondary,
    marginRight: "8px",
  },
  "& ul": {
    margin: "8px 0",
    paddingLeft: "20px",
  },
}));
