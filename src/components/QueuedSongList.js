import React, { useContext } from "react";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Avatar,
  Card,
  CardContent,
  IconButton,
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

import { useMutation } from "@apollo/client";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutation";
import { SongContext } from "../App";
import { style } from "@mui/system";

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

function QueuedSongList({ queue }) {
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    greaterThanMd && (
      <Card sx={{ margin: "10px 0" }}>
        <CardContent>
          <Typography color='textPrimary' variant='button'>
            QUEUE ({queue.length})
          </Typography>

          {queue.map((song, i) => (
            <QueuedSong key={i} song={song} />
          ))}
        </CardContent>
      </Card>
    )
  );
}

function QueuedSong({ song }) {
  const { thumbnail, artist, title } = song;

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
  }

  function handleToglePlay() {
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch({ type: "PLAY_SONG" });
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
        <ListItemText primary={title} secondary={artist} />
        <IconButton onClick={handleAddOrRemoveFromQueue}>
          <RemoveCircleIcon color='action' />
        </IconButton>
      </ListItem>
      <Divider variant='inset' component='li' />
    </List>
  );
}

export default QueuedSongList;
