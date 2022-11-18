import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Layout } from "../../../components/Layout";
import { useGlobalClasses } from "../../../theme";
import UmpireTable from "../../../components/ui/UmpireTable";
import { useRouter } from "next/router";
import { useFetchJobs } from "../../../hooks/useFetchJobs";
import { UmpireJob } from "../../../utils/model";
import {
  formatComparator,
  formatFormula,
  formatJobStatus,
  formatTimestamp,
} from "../../../utils/formatting";
import { BigNumber } from "ethers";

const useListJobs = () => {
  const { jobs } = useFetchJobs(true);
  const router = useRouter();
  const createNewJob = () => router.push("/jobs/create/step1");
  const [formattedJobs, setFormattedJobs] = useState<any[]>([]);

  const formatRow = (row: UmpireJob): any => {
    return {
      jobId: BigNumber.from(row.id).toNumber(),
      jobName: row.jobName,
      status: formatJobStatus(row.jobStatus),
      formula: `${formatFormula(row.formulaLeft, row.dataFeeds)} ${formatComparator(
        row.comparator
      )} ${formatFormula(row.formulaRight, row.dataFeeds)}`,
      dateCreated: formatTimestamp(row.createdAt),
      timeout: formatTimestamp(row.timeoutDate),
    };
  };

  useEffect(() => {
    const newJobs = jobs.map((job: UmpireJob) => formatRow(job));
    setFormattedJobs(newJobs);
  }, [jobs]);

  return { jobs: formattedJobs, createNewJob };
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
  const { jobs } = useListJobs();

  return (
    <Layout>
      <Box className={classes.container}>
        <Box className={classes.centeredRow}>
          <UmpireTable tableId="jobs" rows={jobs} columns={TABLE_COLUMNS} />
        </Box>
      </Box>
    </Layout>
  );
};

export default ListJobs;
