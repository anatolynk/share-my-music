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

import React, { useContext, useState } from "react";
import QueuedSongList from "./QueuedSongList";

import theme from "../theme";
import { SongContext } from "../App";
import { useQuery } from "@apollo/client";
import { GET_QUEUED_SONGS } from "../graphql/queries";

import ReactPlayer from "react-player";

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
  const { data, loading, error } = useQuery(GET_QUEUED_SONGS);
  const reactPlayerRef = React.useRef();
  const { state, dispatch } = useContext(SongContext);

  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    const songIndex = data.queue.findIndex((song) => song.id === state.song.id);
  }, [state.song.id]);

  function handleToglePlay() {
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  function handleProgressChange(event, newValue) {
    setPlayed(newValue);
    console.log(newValue);
  }

  function handleSeekingMouseDown() {
    setSeeking(true);
  }
  function handleSeekingMouseUp() {
    setSeeking(false);
    reactPlayerRef.current.seekTo(played);
  }

  function formatDuratiom(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
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
              {formatDuratiom(playedSeconds)}
            </Typography>
          </div>
          <Slider
            onMouseDown={handleSeekingMouseDown}
            onMouseUp={handleSeekingMouseUp}
            value={played}
            onChange={handleProgressChange}
            type='range'
            min={0}
            max={1}
            step={0.01}
          ></Slider>
        </div>
        <ReactPlayer
          ref={reactPlayerRef}
          onProgress={({ played, playedSeconds }) => {
            if (!seeking) {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
            }
          }}
          hidden
          url={state.song.url}
          playing={state.isPlaying}
        />
        <CardMedia sx={styles.thumbnail} image={state.song.thumbnail} />
      </Card>
      <QueuedSongList queue={data.queue} />
    </div>
  );
}

export default SongPlayer;
