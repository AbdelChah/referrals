// Helper function to get status color
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "green";
    case "pending":
      return "orange";
    case "completed":
      return "red";
    default:
      return "gray";
  }
};