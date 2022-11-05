import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Button, Box } from "@mui/material";
import { Layout } from "../../../components/Layout";
import { useGlobalClasses } from "../../../theme";
import UmpireTable from "../../../components/ui/UmpireTable";
import { useContract } from "../../../hooks/useContract";
import { useRouter } from "next/router";

interface IUmpireJob {
  jobId: string;
  name: string;
  status: string;
  formula: string;
  dateCreated: string;
  timeout: string;
}

enum EUmpireJobStatus {
  NEW = "NEW",
  POSITIVE = "POSITIVE",
  REVERTED = "REVERTED",
  NEGATIVE = "NEGATIVE",
}
const useListJobs = () => {
  // const {} = useContract(); //TODO Run contract to fetch jobs
  const router = useRouter();
  const createNewJob = () => router.push("/jobs/create");

  const [jobs, setJobs] = useState<IUmpireJob[]>([
    {
      jobId: "3",
      name: "Some job 1",
      status: EUmpireJobStatus.NEW,
      formula: "[BTC/USD] > 20,000",
      dateCreated: "2022-10-01",
      timeout: "In 20 days",
    },
  ]);
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

const ListJobs = () => {
  const classes = useGlobalClasses();
  const { jobs, createNewJob } = useListJobs();
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
