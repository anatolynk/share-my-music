import { createTheme } from "@mui/material/styles";
import { blueGrey, deepPurple, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: blueGrey[900],
    },
    secondary: {
      main: deepPurple[900],
    },
    footer: {
      main: grey[200],
    },
  },
});

export default theme;
