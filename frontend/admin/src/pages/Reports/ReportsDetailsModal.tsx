import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";

interface ReportsDetailsModalProps {
  open: boolean;
  onClose: () => void;
  campaign: any;
}

const ReportsDetailsModal: React.FC<ReportsDetailsModalProps> = ({
  open,
  onClose,
  campaign,
}) => {
  const theme = useTheme(); // Access the theme to use the primary color

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        Campaign Details
      </DialogTitle>
      <DialogContent>
        {campaign ? (
          <Box>
            <Box mb={2} sx={{ padding: "16px", backgroundColor: "#f4f6f8", borderRadius: "8px" }}>
              <Typography variant="h6" sx={{ marginBottom: "8px", color: "#333" }}>
                Campaign: {campaign.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>Start Date:</strong> {new Date(campaign.start_date).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>End Date:</strong> {new Date(campaign.end_date).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>Min Referees:</strong> {campaign.min_referees}
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>Reward Amount:</strong> {campaign.reward_criteria.reward_amount} {campaign.reward_criteria.currency}
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>Onboarding Required:</strong> {campaign.reward_criteria.onBoarding ? "Yes" : "No"}
              </Typography>
            </Box>

            <Divider sx={{ margin: "16px 0" }} />

            <Box>
              <Typography variant="h6" sx={{ marginBottom: "12px", color: "#333" }}>
                Referrers and Referees:
              </Typography>
              {campaign.referrers?.map((referrer: any) => (
                <Accordion key={referrer.referrer_phone} defaultExpanded sx={{ marginBottom: "10px" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: theme.palette.primary.main, // Using Bob's yellow color
                      padding: "12px",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#ffffff" }}>
                      Referrer: {referrer.referrer_phone}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#f0f4f7", padding: "16px" }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>Referee List:</Typography>
                    {referrer.referees?.map((referee: any) => (
                      <Box
                        key={referee.referee_phone}
                        sx={{
                          padding: "12px",
                          margin: "10px 0",
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          <strong>Referee Phone:</strong> {referee.referee_phone}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          <strong>Status:</strong> {referee.status ? "Completed" : "Not Completed"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          <strong>Start Date:</strong> {new Date(referee.start_date).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          <strong>Completion Date:</strong> {referee.completion_date ? new Date(referee.completion_date).toLocaleString() : "N/A"}
                        </Typography>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: "#999" }}>
            No campaign data available
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined" sx={{ fontWeight: "bold", borderRadius: "8px" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportsDetailsModal;
