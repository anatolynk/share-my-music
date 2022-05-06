import {
  PlayArrowRounded,
  SkipNextRounded,
  SkipPreviousRounded,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import React from "react";
import QueuedSongList from "./QueuedSongList";

import theme from "../theme";

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    padding: "0px 15px",
  },
  content: {
    flex: "1 0 auto",
  },
  thumbnail: {
    width: 150,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
};

function SongPlayer() {
  return (
    <div>
      <Card sx={styles.container} variant='outlined'>
        <div style={styles.details}>
          <CardContent sx={styles.content}>
            <Typography variant='h5' component='h3'>
              Title
            </Typography>
            <Typography variant='subtitle1' component='p' color='textPrimary'>
              Artist
            </Typography>
          </CardContent>
          <div style={styles.controls}>
            <IconButton>
              <SkipPreviousRounded />
            </IconButton>
            <IconButton>
              <PlayArrowRounded sx={styles.playIcon} />
            </IconButton>
            <IconButton>
              <SkipNextRounded />
            </IconButton>
            <Typography variant='subtitle1' component='p' color='textPrimary'>
              00:01:30
            </Typography>
          </div>
          <Slider type='range' min={0} max={1} ste={0.01}></Slider>
        </div>
        <CardMedia
          sx={styles.thumbnail}
          image='https://media.sellfy.com/images/fQjcOVwV/VuKJxSPX1blWoUdHgUpd/q35cEAtjvN.jpeg?w=760'
        />
      </Card>
      <QueuedSongList />
    </div>
  );
}

export default SongPlayer;
