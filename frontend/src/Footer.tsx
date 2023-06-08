import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        提供元: V-cube.inc
      </Typography>
      <Typography variant="body2" color="textSecondary">
        &copy; {new Date().getFullYear()} All rights reserved.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <IconButton
          component={Link}
          href="https://www.facebook.com/example"
          target="_blank"
          rel="noopener"
        >
          <Facebook />
        </IconButton>
        <IconButton
          component={Link}
          href="https://www.twitter.com/example"
          target="_blank"
          rel="noopener"
        >
          <Twitter />
        </IconButton>
        <IconButton
          component={Link}
          href="https://www.instagram.com/example"
          target="_blank"
          rel="noopener"
        >
          <Instagram />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
