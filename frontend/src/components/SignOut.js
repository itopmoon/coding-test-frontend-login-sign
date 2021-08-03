import { Button, Grid } from "@material-ui/core";

export const SignOut = ({ onSignOut }) => {
  return (
    <Grid style={{ marginTop: 24 }}>
      <Button variant="outlined" onClick={() => onSignOut()}>
        Sign Out
      </Button>
    </Grid>
  );
};
