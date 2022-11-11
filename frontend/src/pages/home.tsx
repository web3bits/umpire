import React, { useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import { Button, Box, Typography } from "@mui/material";
import { useGlobalContext } from "../context/GlobalContext";
import { Layout } from "../components/Layout";
import { useGlobalClasses } from "../theme";

const useHome = (user: any) => {
  const { setUser, setLoading } = useGlobalContext();
  useEffect(() => {
    if (user) {
      setLoading(false);
    }
    setUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return {};
};
function Home({ user }: { user: any }) {
  useHome(user);
  const classes = useGlobalClasses();
  return (
    <Layout>
      <Box className={classes.container}>
        <Typography variant="h5">User session:</Typography>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <Button
          variant="outlined"
          onClick={() =>
            signOut({
              //@ts-ignore
              redirect: "/signin",
            })
          }
        >
          Sign out
        </Button>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session?.user ?? null },
  };
}

export default Home;
