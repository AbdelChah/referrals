// Settings.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Correct hook for react-router-dom v6
import { Box, Card, CardContent, Button, Typography } from '@mui/material';

const Settings: React.FC = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle Reset Password button click
  const handleResetPasswordClick = () => {
    navigate('/reset-password'); // Use navigate to redirect
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Admin Settings
          </Typography>

          {/* Information section */}
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Here you can manage your account settings. You can update your details, change your preferences, or reset your password.
          </Typography>

          {/* <Typography variant="h6" gutterBottom>
            User Info:
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Name: John Doe
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Email: johndoe@example.com
          </Typography> */}

          {/* Reset Password Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 3 }}
            onClick={handleResetPasswordClick} // Call the function on click
          >
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
