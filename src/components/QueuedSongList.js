import React from "react";

import { DeleteRounded } from "@mui/icons-material";
import { Avatar, IconButton, Typography, useMediaQuery } from "@mui/material";

import { useMutation } from "@apollo/client";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutation";

const styles = {
  avatar: {
    width: 44,
    height: 44,
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
};

function QueuedSongList({ queue }) {
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    greaterThanMd && (
      <div style={{ margin: "10px 0" }}>
        <Typography color='textPrimary' variant='button'>
          QUEUE ({queue.length})
        </Typography>

        {queue.map((song, i) => (
          <QueuedSong key={i} song={song} />
        ))}
      </div>
    )
  );
}

function QueuedSong({ song }) {
  const { thumbnail, artist, title } = song;
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
  return (
    <div style={styles.container}>
      <Avatar sx={styles.avatar} src={thumbnail} />
      <div style={styles.songInfoContainer}>
        <Typography variant='subtitle2' sx={styles.text}>
          {title}
        </Typography>
        <Typography color='textPrimary' variant='body2' sx={styles.text}>
          {artist}
        </Typography>
      </div>
      <IconButton onClick={handleAddOrRemoveFromQueue}>
        <DeleteRounded color='error' />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;
