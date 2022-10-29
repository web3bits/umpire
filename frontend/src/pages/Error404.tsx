import Typography from "@mui/material/Typography";

export const Error404 = () => {
  return (
    <Typography
      sx={{ marginTop: "100px" }}
      component="h1"
      variant="h4"
      align="center"
      color="text.primary"
      gutterBottom
    >
      404 - page not found
    </Typography>
  );
};
