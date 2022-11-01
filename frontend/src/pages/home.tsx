import React from "react";
import { getSession, signOut } from "next-auth/react";

// gets a prop from getServerSideProps

function Home({ user }: { user: any }) {
  return (
    <div style={{ margin: "1rem" }}>
      <h4>User session:</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button
        onClick={() =>
          signOut({
            //@ts-ignore
            redirect: "/signin",
          })
        }
      >
        Sign out
      </button>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  // redirect if not authenticated
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/signin",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { user: session?.user ?? null },
  };
}

export default Home;
