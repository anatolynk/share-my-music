import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

function Header() {
  //   const aboutColors = blueGrey[900];
  return (
    <AppBar color='footer' position='fixed' sx={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <Typography variant='body2' component='p'>
          Project: React, Context API, Apollo GraphQL, ReactPlayer, Material UI
          - Anatoly Nikulyak, contact: https://github.com/anatolynk
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
