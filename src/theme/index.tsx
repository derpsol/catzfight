import PropTypes from "prop-types";
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = createTheme({
    palette: {
      mode: "light",
      common: {
        black: "#16151a",
      },
      primary: {
        light: "#62ceec",
        main: "#6164ff",
        dark: "#2847EE",
      },
      secondary: {
        light: "#f59b2f",
        main: "#ff7523",
        dark: "#3f1d3f",
      },
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
