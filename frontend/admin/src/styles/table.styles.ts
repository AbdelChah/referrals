import { styled } from "@mui/material/styles";
import {
  Table,
  TableCell,
  TableRow,
  Button,
  Fab,
  Typography,
} from "@mui/material";

// Container for the entire page
export const Container = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));

// Page Title
export const Title = styled("h1")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: "bold",
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

// Styled Table
export const StyledTable = styled(Table)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

// Table Header Cell
export const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textAlign: "left",
  padding: theme.spacing(1.5),
}));

// Table Cell
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  textAlign: "left",
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
}));

// Table Row
interface StyledTableRowProps {
  cursor?: string;
}

export const StyledTableRow = styled(TableRow)<StyledTableRowProps>(
  ({ theme, cursor = "pointer" }) => ({
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
    cursor,
  })
);

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5), // Match Referral Table button size
  fontSize: "13px", // Ensure font size is consistent with Referral Table
  textTransform: "none", // Disable uppercase transformation
  border: `1px solid ${theme.palette.primary.main}`, // Border for outlined style
  borderRadius: "4px", // Rounded corners
  color: theme.palette.primary.main, // Text color matches Referral Table
  backgroundColor: theme.palette.common.white, // White background for default state
  transition: "all 0.3s ease", // Smooth hover transition

  "&:hover": {
    backgroundColor: theme.palette.action.hover, // Subtle hover effect
    borderColor: theme.palette.primary.dark, // Darken border on hover
  },

  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground, // Disabled background
    color: theme.palette.action.disabled, // Disabled text color
    borderColor: theme.palette.action.disabledBackground, // Disabled border
  },
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

export const MessageContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
}));

// Styled Typography for the message
export const Message = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
  fontSize: "18px",
  fontWeight: 500,
}));


export const TableHeaderContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
}));

export const SortIconContainer = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  display: "inline-flex",
  alignItems: "center",
}));
