import { AppBar, Toolbar, Typography } from "@mui/material";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import React from "react";

function Header() {
  return (
    <AppBar color='primary' position='fixed'>
      <Toolbar>
        <GraphicEqRoundedIcon />
        <Typography variant='h6' component='h1'>
          Share My Music
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
