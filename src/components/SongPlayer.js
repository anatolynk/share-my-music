import {
  PauseCircleRounded,
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

import React, { useContext } from "react";
import QueuedSongList from "./QueuedSongList";

import theme from "../theme";
import { SongContext } from "../App";

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
  const { state, dispatch } = useContext(SongContext);

  function handleToglePlay() {
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }
  return (
    <div>
      <Card sx={styles.container} variant='outlined'>
        <div style={styles.details}>
          <CardContent sx={styles.content}>
            <Typography variant='h5' component='h3'>
              {state.song.title}
            </Typography>
            <Typography variant='subtitle1' component='p' color='textPrimary'>
              {state.song.artist}
            </Typography>
          </CardContent>
          <div style={styles.controls}>
            <IconButton>
              <SkipPreviousRounded />
            </IconButton>
            <IconButton onClick={handleToglePlay}>
              {!state.isPlaying ? (
                <PlayArrowRounded sx={styles.playIcon} />
              ) : (
                <PauseCircleRounded sx={styles.playIcon} />
              )}
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
        <CardMedia sx={styles.thumbnail} image={state.song.thumbnail} />
      </Card>
      <QueuedSongList />
    </div>
  );
}

export default SongPlayer;
