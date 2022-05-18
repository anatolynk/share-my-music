import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";

function Header() {
  return (
    <AppBar color='primary' position='fixed'>
      <Toolbar>
        <GraphicEqRoundedIcon />
        <Typography variant='h6' component='h1'>
          &nbsp; My Music — Playlist Player
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
