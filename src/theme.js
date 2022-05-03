import { createTheme } from "@mui/material/styles";
import { blueGrey, deepPurple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: blueGrey[900],
    },
    secondary: {
      main: deepPurple[900],
    },
  },
});

export default theme;
