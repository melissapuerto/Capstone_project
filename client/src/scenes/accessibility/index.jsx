import React from "react";
import { Box, Typography, Link, useTheme } from "@mui/material";

const Accessibility = () => {
  const theme = useTheme();
  return (
    <Box m="2rem auto" maxWidth={700}>
      <Typography variant="h3" gutterBottom>
        Accessibility Statement
      </Typography>
      <Typography variant="body1" paragraph>
        We are committed to ensuring that our application is accessible to all users, regardless of their abilities or disabilities. We strive to adhere to the highest standards of accessibility and inclusivity, making our platform usable for everyone.
      </Typography>
      <Typography variant="body1" paragraph>
        Our team continuously works to improve the accessibility of our application by following best practices and guidelines. We regularly review our platform to identify and address any barriers that may prevent users from fully engaging with our content.
      </Typography>
      <Typography variant="body1" paragraph>
        If you encounter any issues or have suggestions on how we can improve accessibility, please reach out to us at{' '}
        <Link
          href="mailto:Tasluf.Morshed@student.lut.fi"
          underline="hover"
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.dark,
            fontWeight: 'bold',
            textDecoration: 'underline',
          }}
        >
          Tasluf.Morshed@student.lut.fi
        </Link>.
        Your feedback is invaluable in helping us create a more accessible and welcoming environment for all.
      </Typography>
    </Box>
  );
};

export default Accessibility; 