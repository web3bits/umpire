import React, { useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import { Button, Box, Typography } from "@mui/material";
import { Header } from "../components/Header";
import { useGlobalContext } from "../context/GlobalContext";

const useHome = (user: any) => {
  const { setUser } = useGlobalContext();
  useEffect(() => {
    setUser(user);
  }, [user]);
  return {};
};
function Home({ user }: { user: any }) {
  useHome(user);
  return (
    <>
      <Header />
      <Box style={{ margin: "1rem" }}>
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
    </>
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
