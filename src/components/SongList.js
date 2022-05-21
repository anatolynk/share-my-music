import { useMutation, useQuery } from "@apollo/client";
import { PlayArrow, PauseCircleRounded } from "@mui/icons-material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CloseIcon from "@mui/icons-material/Close";

import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Link,
  Typography,
} from "@mui/material";

import React, { useContext, useState, useEffect } from "react";

import theme from "../theme";

import { SongContext } from "../App";

import { GET_SONGS } from "../graphql/queries";
import { ADD_OR_REMOVE_FROM_QUEUE, DELETE_SONG } from "../graphql/mutation";
import toast from "react-hot-toast";

function SongList() {
  const { data, loading, error, refetch } = useQuery(GET_SONGS);

  const [AlertNotification, setAlertNotification] = useState(true);

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

  return (
    <div>
      <center>
        {AlertNotification && (
          <Card sx={styles.container} variant='outlined'>
            <div>
              <Alert
                sx={styles.songInfoContainer}
                variant='outlined'
                severity='success'
                onClose={(e) => {
                  setAlertNotification(false);
                }}
              >
                Find any song from&nbsp;
                <Link
                  href='https://www.youtube.com/c/TSGMusic/videos'
                  underline='hover'
                  target='_blank'
                  rel='noreferrer'
                  color='secondary'
                >
                  YouTube
                </Link>
                &nbsp;or&nbsp;
                <Link
                  href='https://soundcloud.com/digitalstreams/sets/drivehomemixtape'
                  underline='hover'
                  target='_blank'
                  rel='noreferrer'
                  color='secondary'
                >
                  SoundCloud
                </Link>
                , copy and paste URL link here.
              </Alert>
            </div>
          </Card>
        )}

        <IconButton
          onClick={() => refetch({})}
          variant='outlined'
          color='primary'
        >
          <RefreshRoundedIcon />
        </IconButton>
      </center>

      {data.songs.map((song) => (
        <Song key={song.id} song={song} />
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
  const [deletedSongStyle, setDeletedSongStyle] = useState(false);
  // Remove song from PlayList and refetch it
  const [deleteSong] = useMutation(DELETE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
  });

  // Add or Remove Song from queue
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
      setDeletedSongStyle(false);
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
    dispatch(
      state.isPlaying && state.song.id === song.id
        ? { type: "PAUSE_SONG" }
        : { type: "PLAY_SONG" }
    );
  }

  async function handleDeleteSong() {
    setDeletedSongStyle(true);
    await deleteSong({
      variables: {
        id: song.id,
      },
    });

    toast((t) => (
      <div>
        <Typography variant='body1' gutterBottom component='div'>
          <b>{song.title.substr(0, 12).concat("...")}</b> successfully deleted
          <IconButton onClick={() => toast.dismiss(t.id)}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Typography>
      </div>
    ));
  }

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: {
        input: { ...song, __typename: "Song" },
      },
    });

    // toast(`You've added song to queue`, {
    //   icon: "👏",
    // });
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
          <CardContent sx={{ opacity: deletedSongStyle ? "0.33" : "1" }}>
            <Typography gutterBottom variant='h5' component='h2'>
              {title}
            </Typography>
            <Typography variant='body1' component='p' color='textSecondary'>
              {artist}
            </Typography>
          </CardContent>
          <CardActions sx={{ opacity: deletedSongStyle ? "0.33" : "1" }}>
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
