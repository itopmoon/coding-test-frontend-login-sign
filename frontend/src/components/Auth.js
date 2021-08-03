import { Card, Container, Typography } from "@material-ui/core";
import { useMetaMask } from "metamask-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";

import { getNonce } from "../api/getNonce";
import { getToken } from "../api/getToken";
import { setUser } from "../store/reducers/auth";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";

export const Auth = () => {
  const dispatch = useDispatch();
  const { account, connect } = useMetaMask();
  const user = useSelector((state) => state.auth.user);

  const login = () => {
    connect();
  };

  const signout = () => {
    dispatch(setUser(null));
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const handleSignMessage = async (nonce) => {
      const web3 = new Web3(Web3.givenProvider);

      try {
        const signature = await web3.eth.personal.sign(
          `One-time Nonce: ${nonce}`,
          account,
          ""
        );
        return signature;
      } catch (err) {
        throw new Error("You need to sign the message to be able to log in.");
      }
    };

    if (!account) {
      dispatch(setUser(null));
    } else {
      const accessToken = localStorage.getItem("token");

      if (accessToken) {
        return dispatch(
          setUser({
            address: account,
            accessToken,
          })
        );
      }
      getNonce(account)
        .then(({ nonce }) => handleSignMessage(nonce))
        .then((signature) => getToken(account, signature))
        .then(({ accessToken }) => {
          localStorage.setItem("token", accessToken);
          dispatch(
            setUser({
              address: account,
              accessToken,
            })
          );
        })
        .catch((err) => {
          console.error(err);
          dispatch(setUser(null));
        });
    }
  }, [dispatch, account]);

  return (
    <Container maxWidth="md" style={{ padding: "10vh 0" }}>
      <Card style={{ padding: 24, textAlign: "left" }}>
        {user && user.accessToken ? (
          <>
            <Typography variant="h6">Wallet:</Typography>
            <Typography>{user.address}</Typography>
            <Typography variant="h6" style={{ marginTop: 12 }}>
              Token:
            </Typography>
            <Typography style={{ overflowWrap: "break-word" }}>
              {user.accessToken}
            </Typography>
            <SignOut onSignOut={() => signout()} />
          </>
        ) : (
          <>
            <Typography variant="h6">MetaMask Login</Typography>
            <SignIn onLoggedIn={() => login()} />
          </>
        )}
      </Card>
    </Container>
  );
};
