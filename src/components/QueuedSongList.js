import { DeleteRounded } from "@mui/icons-material";
import { Avatar, IconButton, Typography } from "@mui/material";
import React from "react";

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

function QueuedSongList() {
  const song = {
    title: "LUNE",
    artist: "MOON",
    thumbnail:
      "https://media.sellfy.com/images/fQjcOVwV/VuKJxSPX1blWoUdHgUpd/q35cEAtjvN.jpeg?w=760",
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <Typography color='textPrimary' variant='button'>
        QUEUE (5)
      </Typography>

      {Array.from({ length: 5 }, () => song).map((song, i) => (
        <QueuedSong key={i} song={song} />
      ))}
    </div>
  );
}

function QueuedSong({ song }) {
  const { thumbnail, artist, title } = song;
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
      <IconButton>
        <DeleteRounded color='error' />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;
