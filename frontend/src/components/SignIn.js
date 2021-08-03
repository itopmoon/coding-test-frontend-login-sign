import { useMetaMask } from "metamask-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Grid } from "@material-ui/core";

export const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const { connect } = useMetaMask();
  const user = useSelector((state) => state.auth.user);

  const onClickLogin = async () => {
    connect();
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
    } else if (
      (user.accessToken && user.address) ||
      (!user.accessToken && !user.address)
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <Grid style={{ marginTop: 24 }}>
      <Button
        variant="outlined"
        disabled={loading}
        onClick={() => onClickLogin()}
      >
        Login
      </Button>
    </Grid>
  );
};
