import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Button, Box } from "@mui/material";
import { Layout } from "../../../components/Layout";
import { useGlobalClasses } from "../../../theme";
import UmpireTable from "../../../components/ui/UmpireTable";
import { useContract } from "../../../hooks/useContract";
import { useRouter } from "next/router";
import { useGlobalContext } from "../../../context/GlobalContext";

interface IUmpireJob {
  jobId: string;
  jobName: string;
  status: string;
  formula: string;
  dateCreated: string;
  timeout: string;
}

const useListJobs = (user: any) => {
  // const {} = useContract(); //TODO Run contract to fetch jobs
  const router = useRouter();
  const createNewJob = () => router.push("/jobs/create/step1");
  const { setUser, setLoading, jobs } = useGlobalContext();
  useEffect(() => {
    if (user) {
      setLoading(false);
    }
    setUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {}, []);
  return { jobs, createNewJob };
};

const TABLE_COLUMNS: string[] = [
  "Job Id",
  "Name",
  "Status",
  "Formula",
  "Date Created",
  "Timeout",
];

const ListJobs = ({ user }: { user: any }) => {
  const classes = useGlobalClasses();
  const { jobs, createNewJob } = useListJobs(user);
  return (
    <Layout>
      <Box className={classes.container}>
        <Box className={classes.centeredRow}>
          <Button variant="outlined" onClick={createNewJob}>
            Create a new Job
          </Button>
        </Box>
        <Box className={classes.centeredRow}>
          <UmpireTable tableId="jobs" rows={jobs} columns={TABLE_COLUMNS} />
        </Box>
      </Box>
    </Layout>
  );
};

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

export default ListJobs;
