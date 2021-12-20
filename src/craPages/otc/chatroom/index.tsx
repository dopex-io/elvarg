import React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';

const Chatroom = () => {
  const chat = useParams();
  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="OTC" />
      <Box className="container pt-24 mx-auto px-4 lg:px-0">
        <Typography variant="h6">Chatroom placeholder {chat.uid}</Typography>
      </Box>
    </Box>
  );
};

export default Chatroom;
