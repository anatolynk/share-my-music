import { AddBoxOutlined, Link } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";

import SoundCloudPlayer from "react-player/soundcloud";
import YouTubePlayer from "react-player/youtube";

import theme from "../theme";

function AddSong() {
  const [dialog, setDialog] = useState(false);

  const [url, setUrl] = useState("");
  const [playable, setPlayable] = useState(false);

  useEffect(() => {
    const isPlayable =
      SoundCloudPlayer.canPlay(url) || YouTubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  function handleCloseDialog() {
    setDialog(false);
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
    thumbnail: {
      width: "90%",
    },
  };

  return (
    <div style={styles.container}>
      <Dialog sx={styles.dialog} open={dialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Song</DialogTitle>

        <DialogContent>
          <img
            style={styles.thumbnail}
            alt='Song Thumbnail'
            src='https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bXVzaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
          />
          <TextField margin='dense' name='title' label='Title' fullWidth />
          <TextField margin='dense' name='Artist' label='Artist' fullWidth />
          <TextField
            margin='dense'
            name='thumbnail'
            label='Thumbnail'
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button variant='contained' color='secondary'>
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
    </div>
  );
}

export default AddSong;
