import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { useGlobalClasses } from "../../theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { Typography } from "@mui/material";
import { useState } from "react";
import {
  EComparator,
  EUmpireJobStatus,
  ICreateJob,
} from "../../context/GlobalContext";
import dayjs from "dayjs";
import UmpireTable from "../../components/ui/UmpireTable";
import UmpireDetailRow from "../../components/ui/UmpireDetailRow";
const useJobDetails = (jobId: string) => {
  const [job, setJob] = useState<ICreateJob | undefined>({
    jobId,
    jobName: "Test",
    actionAddress: "x00a0000230230203",
    leftSide: "[INCH / ETH]",
    comparator: EComparator.EQUAL,
    rightSide: "12",
    activationDate: dayjs().add(10, "minutes").unix(),
    deadlineDate: dayjs().add(30, "minutes").unix(),
    status: EUmpireJobStatus.NEW,
  });
  return { job };
};
const JobDetails = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { job } = useJobDetails(jobId as string);
  const classes = useGlobalClasses();
  return (
    <Layout>
      <Box className={classes.container}>
        <Box className={classes.mt2}>
          <Link href="/jobs/list" title="Job list">
            <ArrowBackIcon className={classes.primaryFont} />
          </Link>
        </Box>
        <UmpireDetailRow label="Job Id" value={jobId as string} />
        <UmpireDetailRow label="Job Name" value={job!.jobName!} />
        <UmpireDetailRow label="Action Address" value={job!.actionAddress!} />
        <UmpireDetailRow
          label="Formula"
          value={`${job!.leftSide} ${job!.comparator} ${job!.rightSide}`}
        />
        <UmpireDetailRow
          label="Activation Date"
          value={`${
            job?.activationDate ? dayjs(job!.activationDate).toISOString() : ""
          } `}
        />
        <UmpireDetailRow
          label="Deadline Date"
          value={`${
            job?.deadlineDate ? dayjs(job!.deadlineDate).toISOString() : ""
          } `}
        />
        <UmpireDetailRow
          label="Created at"
          value={`${dayjs(job!.dateCreated).toISOString()}`}
        />
      </Box>
    </Layout>
  );
};

export default JobDetails;
