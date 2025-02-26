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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: any; // User data passed as a prop
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  open,
  onClose,
  user,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        {user ? (
          <>
            <Box mb={2}>
              <Typography variant="h6">
                Referrer Phone: {user.referrer_phone}
              </Typography>
              {user.campaigns.map((campaign: any) => (
                <Accordion
                  key={
                    campaign.campaignId ||
                    `${campaign.campaignName}-${campaign.index}`
                  }
                  defaultExpanded
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      {campaign.campaignName}{" "}
                      <span style={{ fontWeight: "bold", color: "#555" }}>
                        ({campaign.status === "active" ? "Active" : "Inactive"})
                      </span>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box mb={2}>
                      <Typography variant="body2">
                        <strong>Completed:</strong>{" "}
                        {campaign.campaignComplete ? "Yes" : "No"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Total Qualified Referees:</strong>{" "}
                        {campaign.totalQualifiedReferees}/
                        {campaign.min_referees}
                      </Typography>
                    </Box>

                    <Box mt={2}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Referees:
                      </Typography>
                      {campaign.referees.length > 0 ? (
                        campaign.referees.map((referral: any) => (
                          <Box
                            key={referral.referee_phone}
                            sx={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              marginBottom: "8px",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <Typography>
                              <strong>Referral ID:</strong>{" "}
                              {referral.referralId}
                            </Typography>
                            <Typography>
                              <strong>Referee Phone:</strong>{" "}
                              {referral.referee_phone}
                            </Typography>
                            <Typography>
                              <strong>Completed:</strong>{" "}
                              {referral.qualified ? "Yes" : "No"}
                            </Typography>
                            <Typography>
                              <strong>Date:</strong>{" "}
                              {new Date(referral.date).toLocaleString()}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography>No referees yet</Typography>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </>
        ) : (
          <Typography>No user data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailModal;
