import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material';

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: any; // User data passed as a prop
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        {user ? (
          <>
            <Box mb={2}>
              <Typography variant="h6">Referrer Phone: {user.referrer_phone}</Typography>
              {user.campaigns.map((campaign: any) => (
                <Box key={campaign.campaignId} sx={{ marginBottom: '16px' }}>
                  <Typography variant="subtitle1">{campaign.campaignName}</Typography>
                  <Box mt={2}>
                    <Typography variant="body2" fontWeight="bold">Referees:</Typography>
                    {campaign.referees.map((referral: any) => (
                      <Box key={referral.referee_phone} sx={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px' }}>
                        <Typography><strong>Referral ID:</strong> {referral.referralId}</Typography>
                        <Typography><strong>Referee Phone:</strong> {referral.referee_phone}</Typography>
                        <Typography><strong>Status:</strong> {referral.status ? "Active" : "Inactive"}</Typography>
                        <Typography><strong>Date:</strong> {new Date(referral.date).toLocaleString()}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
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
