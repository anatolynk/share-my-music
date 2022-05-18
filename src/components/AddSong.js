import { AddBoxOutlined, Link } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

import SoundCloudPlayer from "react-player/soundcloud";
import YouTubePlayer from "react-player/youtube";

import theme from "../theme";

import { ADD_SONG } from "../graphql/mutation";
import { useMutation } from "@apollo/client";
import { GET_SONGS } from "../graphql/queries";

function AddSong() {
  const [dialog, setDialog] = useState(false);
  const [addSong, { error }] = useMutation(ADD_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
  });
  const [url, setUrl] = useState("");
  const [playable, setPlayable] = useState(false);

  const DEFAULT_SONG = {
    duration: 0,
    title: "",
    artist: "",
    thumbnail: "",
  };

  const [song, setSong] = useState(DEFAULT_SONG);

  function handleCloseDialog() {
    setDialog(false);
  }

  useEffect(() => {
    const isPlayable =
      SoundCloudPlayer.canPlay(url) || YouTubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  function handleChangeSong(event) {
    const { name, value } = event.target;

    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  }

  async function handleAddSong() {
    try {
      const { url, thumbnail, artist, title, duration } = song;

      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          artist: artist.length > 0 ? artist : null,
          title: title.length > 0 ? title : null,
          duration: duration > 0 ? duration : null,
        },
      });
      handleCloseDialog();
      setSong(DEFAULT_SONG);
      setUrl("");
    } catch (error) {
      // console.log("Error adding song: ", error);
    }
  }

  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;

    let songData;

    if (nestedPlayer.getVideoData) {
      // it's youtube url
      songData = await getYoutubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      // it's soundcloud url
      songData = await getSoundCloudInfo(nestedPlayer);
    }

    setSong({ ...songData, url });
  }

  function getYoutubeInfo(player) {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `https://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  }

  function getSoundCloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  }

  const styles = {
    test: {
      color: "red",
    },
    container: {
      display: "flex",
      alignItems: "center",
      color: "red",
    },
    urlInput: {
      margin: theme.spacing(1),
    },
    addSongButton: {
      margin: theme.spacing(1),
    },
    dialog: {
      textAlign: "center",
    },
    center: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    thumbnail: {
      width: "50%",
      height: "50%",
    },
  };

  function handleError(field) {
    return error?.graphQLErrors[0]?.extensions?.path.includes(field);
  }

  const { title, artist, thumbnail } = song;

  return (
    <div style={styles.container}>
      <Dialog sx={styles.dialog} open={dialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Song</DialogTitle>

        <DialogContent>
          {!thumbnail && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CircularProgress color='primary' />
            </div>
          )}
          <div style={styles.center}>
            <Avatar
              sx={styles.thumbnail}
              alt='Song Thumbnail'
              src={thumbnail}
            />
          </div>
          <TextField
            value={title}
            margin='dense'
            name='title'
            label='Title'
            fullWidth
            error={handleError("title")}
            helperText={handleError("title") && "Fill out field"}
            onChange={handleChangeSong}
          />
          <TextField
            onChange={handleChangeSong}
            value={artist}
            margin='dense'
            name='artist'
            label='Artist'
            fullWidth
            error={handleError("artist")}
            helperText={handleError("artist") && "Fill out field"}
          />
          <TextField
            value={thumbnail}
            onChange={handleChangeSong}
            margin='dense'
            name='thumbnail'
            label='Thumbnail'
            fullWidth
            error={handleError("thumbnail")}
            helperText={handleError("thumbnail") && "Fill out field"}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleAddSong} variant='contained' color='secondary'>
            Add Song
          </Button>
          <Button onClick={handleCloseDialog} color='secondary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        onChange={(event) => setUrl(event.target.value)}
        value={url}
        sx={styles.urlInput}
        placeholder='Add Music URL - youtube or soundcloud'
        fullWidth
        margin='normal'
        type='url'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Link />
            </InputAdornment>
          ),
        }}
      ></TextField>
      <Button
        disabled={!playable}
        sx={styles.addSongButton}
        onClick={() => setDialog(true)}
        variant='contained'
        color='primary'
        endIcon={<AddBoxOutlined />}
      >
        Add
      </Button>
      <ReactPlayer url={url} hidden={true} onReady={handleEditSong} />
    </div>
  );
}

export default AddSong;
