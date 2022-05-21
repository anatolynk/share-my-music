import React, { useContext } from "react";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";

import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_OR_REMOVE_FROM_QUEUE,
  REMOVE_ALL_SONGS_FROM_QUEUE,
} from "../graphql/mutation";
import { SongContext } from "../App";
import { style } from "@mui/system";
import toast from "react-hot-toast";
import { GET_QUEUED_SONGS } from "../graphql/queries";

const styles = {
  avatar: {
    width: 44,
    height: 44,
    cursor: "pointer",
  },

  text: {
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  container: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "50px auto 50px",
    gridGap: 12,
    alignItems: "center",
    marginTop: 10,
  },
  songInfoContainer: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  playnow: {
    backgroundColor: "#E8E8E8",
    borderRadius: "10px",
  },
};

function QueuedSongList({ queue, reactPlayerRef }) {
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { state, dispatch } = useContext(SongContext);

  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });

  function handleAllPlay() {
    const song = queue[0];
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch({ type: "PLAY_SONG" });
    reactPlayerRef.current.seekTo(0);
  }
  function handleShuffle() {
    const randomSong = Math.floor(Math.random() * queue.length);
    let song = queue[randomSong];

    if (song.id === state.song.id) {
      song = queue[randomSong + 1];
    }

    if (!song) {
      song = queue[0];
    }
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch({ type: "PLAY_SONG" });
    reactPlayerRef.current.seekTo(0);
  }

  function handleRemoveAllSongsFromQueue() {
    queue.forEach((song) => {
      addOrRemoveFromQueue({
        variables: {
          input: { ...song, __typename: "Song" },
        },
      });
    });
  }

  return (
    greaterThanMd && (
      <Card sx={{ margin: "10px 0" }}>
        <CardContent>
          <Typography variant='h5' component='h3'>
            Queue
          </Typography>
          <Button
            disabled={!queue.length}
            onClick={handleAllPlay}
            variant='contained'
            color='secondary'
            startIcon={<PlayArrowRoundedIcon />}
          >
            Play All ({queue.length})
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            disabled={!(queue.length > 1)}
            onClick={handleShuffle}
            variant='outlined'
            color='secondary'
            startIcon={<ShuffleRoundedIcon />}
          >
            Shuffle
          </Button>
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <IconButton
            disabled={!queue.length}
            onClick={handleRemoveAllSongsFromQueue}
            variant='outlined'
            color='secondary'
          >
            <ClearAllIcon />
          </IconButton>
          {queue.map((song, i) => (
            <QueuedSong key={i} song={song} />
          ))}
        </CardContent>
      </Card>
    )
  );
}

function QueuedSong({ song }) {
  const { thumbnail, artist, title, duration } = song;

  const { state, dispatch } = useContext(SongContext);

  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: {
        input: { ...song, __typename: "Song" },
      },
    });
    toast((t) => (
      <div>
        <Typography variant='body1' gutterBottom component='div'>
          <b>{song.artist.substr(0, 10)}</b> removed from queue
          <IconButton onClick={() => toast.dismiss(t.id)}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Typography>
      </div>
    ));
  }

  function handleToglePlay() {
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch(
      state.isPlaying && state.song.id === song.id
        ? { type: "PAUSE_SONG" }
        : { type: "PLAY_SONG" }
    );
  }

  // Convert seconds timestamp into comfort format hh:mm:ss
  function formatDuratiom(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  return (
    <List>
      <ListItem
        alignItems='flex-start'
        sx={song.id === state.song.id ? styles.playnow : null}
      >
        <ListItemAvatar>
          <Avatar
            onClick={handleToglePlay}
            sx={styles.avatar}
            src={thumbnail}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            title.length > 50
              ? title.substr(0, 42).concat("...")
              : title.substr(0, 45)
          }
          secondary={artist}
        />
        {/* <ListItemText secondary={formatDuratiom(duration)} /> */}
        <Typography
          variant='subtitle2'
          component='p'
          color='textPrimary'
          sx={{ paddingTop: "12px", paddingRight: "7px" }}
        >
          {formatDuratiom(duration)}
        </Typography>
        <IconButton onClick={handleAddOrRemoveFromQueue}>
          <br />
          <RemoveCircleIcon color='action' />
        </IconButton>
      </ListItem>
      <Divider variant='inset' component='li' />
    </List>
  );
}

export default QueuedSongList;
