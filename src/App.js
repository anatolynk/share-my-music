import { Grid, Hidden, useMediaQuery } from "@mui/material";
import React, { createContext, useContext, useReducer } from "react";
import AddSong from "./components/AddSong";
import Header from "./components/Header";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";

import songReducer from "./reducer";

export const SongContext = createContext({
  song: {
    id: "30b5a865-330d-4902-b9d7-340ee0756579",
    title: "HeɅven - Memories We Make (feat. Schmorgle)",
    artist: "Schmorgle",
    thumbnail: "https://img.youtube.com/vi/TC4Day25FfI/0.jpg",
    url: "https://www.youtube.com/watch?v=pxxeqmaCE-Q&list=PLs5sIYgM4NpKSES21ODWQIZVypLNj8Fl4&index=2",
    duration: 170,
  },
  isPlaying: false,
});

function App() {
  const initialSongState = useContext(SongContext);
  const [state, dispatch] = useReducer(songReducer, initialSongState);
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const greaterThanSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <Hidden only='xs'>
        <Header />
      </Hidden>
      <Grid container spacing={3}>
        <Grid
          style={{
            paddingTop: greaterThanSm ? "90px" : "30px",
          }}
          item
          xs={12}
          md={7}
        >
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          style={
            greaterThanMd
              ? {
                  position: "fixed",
                  width: "100%",
                  right: 0,
                  top: 70,
                }
              : {
                  position: "fixed",
                  width: "100%",
                  left: 0,
                  bottom: 0,
                }
          }
          item
          xs={12}
          md={5}
        >
          <SongPlayer />
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;
