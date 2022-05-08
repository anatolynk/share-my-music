import { qgl, useQuery } from "@apollo/client";
import { LibraryAddRounded, PlayArrow } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

import { GET_SONGS } from "../graphql/queries";

import theme from "../theme";

function SongList() {
  const { data, loading, error } = useQuery(GET_SONGS);

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

  if (error) return <div>Error fetcheing songs</div>;
  return (
    <div>
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
  },
};

function Song({ song }) {
  const { title, artist, thumbnail } = song;
  return (
    <Card sx={styles.container}>
      <div style={styles.songInfoContainer}>
        <CardMedia image={thumbnail} sx={styles.thumbnail} />
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
            <IconButton size='small' color='primary'>
              <PlayArrow />
            </IconButton>
            <IconButton size='small' color='primary'>
              <LibraryAddRounded />
            </IconButton>
          </CardActions>
        </div>
      </div>
    </Card>
  );
}

export default SongList;
