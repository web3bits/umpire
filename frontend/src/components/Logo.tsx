import Typography from "@mui/material/Typography";

export const Logo = () => {
  return (
    <Typography
      variant="h5"
      noWrap
      component="a"
      href=""
      sx={{
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".3rem",
        color: "inherit",
        textDecoration: "none",
        display: "flex",
        alignItems: "end",
        height: "25px",
        lineHeight: "30px",
      }}>
      Umpire
    </Typography>
  );
};
