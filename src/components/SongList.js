import { qgl, useMutation, useQuery } from "@apollo/client";
import {
  LibraryAddRounded,
  PlayArrow,
  PauseCircleRounded,
} from "@mui/icons-material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import IndeterminateCheckBoxRoundedIcon from "@mui/icons-material/IndeterminateCheckBoxRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";

import React, { useContext, useState, useEffect } from "react";

import theme from "../theme";

import { SongContext } from "../App";

import { GET_SONGS } from "../graphql/queries";
import { ADD_OR_REMOVE_FROM_QUEUE, DELETE_SONG } from "../graphql/mutation";

function SongList() {
  const { data, loading, error, refetch } = useQuery(GET_SONGS);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <CircularProgress color='primary' />
      </div>
    );
  }

  if (error) return <Alert severity='error'>Error fetching songs</Alert>;

  const queueList = JSON.parse(localStorage.getItem("queue"));

  // Find song.id inside queue array
  const isAddedToQueue = (s, q) => {
    return q.filter((e) => e.id === s.id).length > 0;
  };

  return (
    <div>
      <center>
        <IconButton
          onClick={() => refetch({})}
          variant='outlined'
          color='primary'
        >
          <RefreshRoundedIcon />
        </IconButton>
      </center>

      {data.songs.map((song) => (
        <Song
          key={song.id}
          song={song}
          isInQueueList={isAddedToQueue(song, queueList)}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    margin: theme.spacing(3),
  },
  songInfoContainer: {
    display: "flex",
    alignItems: "center",
  },
  songInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  thumbnail: {
    objectFit: "cover",
    width: 140,
    height: 140,
    cursor: "pointer",
  },
};

function Song({ song }) {
  // Remove song from PlayList and refetch it
  const [deleteSong] = useMutation(DELETE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
  });

  // Add or Remove Song from queue
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });
  const { state, dispatch } = useContext(SongContext);
  const { title, artist, thumbnail } = song;

  const [currentSongPlaying, setCurrentSongPlaying] = useState(false);

  useEffect(() => {
    const isSongPlaying = state.isPlaying && song.id === state.song.id;
    setCurrentSongPlaying(isSongPlaying);
  }, [song.id, state.song.id, state.isPlaying]);

  function handleToglePlay() {
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  async function handleDeleteSong() {
    await deleteSong({
      variables: {
        id: song.id,
      },
    });
  }

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: {
        input: { ...song, __typename: "Song" },
      },
    });
  }

  return (
    <Card sx={styles.container} variant='outlined'>
      <div style={styles.songInfoContainer}>
        <CardMedia
          image={thumbnail}
          sx={styles.thumbnail}
          onClick={handleToglePlay}
        />
        <div style={styles.songInfo}>
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {title}
            </Typography>
            <Typography variant='body1' component='p' color='textSecondary'>
              {artist}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton size='small' color='primary' onClick={handleToglePlay}>
              {!currentSongPlaying ? <PlayArrow /> : <PauseCircleRounded />}
            </IconButton>
            <IconButton
              onClick={handleAddOrRemoveFromQueue}
              size='small'
              color='primary'
            >
              <PlaylistAddIcon />
            </IconButton>
            <IconButton onClick={handleDeleteSong} size='small' color='primary'>
              <DeleteRoundedIcon />
            </IconButton>
          </CardActions>
        </div>
      </div>
    </Card>
  );
}

export default SongList;
