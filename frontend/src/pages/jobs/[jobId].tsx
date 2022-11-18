import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { useGlobalClasses } from "../../theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import dayjs from "dayjs";
import UmpireDetailRow from "../../components/ui/UmpireDetailRow";
import { useFetchJobDetails } from "../../hooks/useFetchJobDetails";
import { BigNumber } from "ethers";

const maybeString = (obj: unknown, key: string): string => {
  return (obj as any)?.[key] ?? "?";
};
const maybeDate = (obj: unknown, key: string): string => {
  return dayjs(
    BigNumber.from((obj as any)?.[key] ?? "0").toNumber() * 1000
  ).toISOString();
};
const JobDetails = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { rawData } = useFetchJobDetails(jobId as string);
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
        <UmpireDetailRow
          label="Job Name"
          value={maybeString(rawData, "jobName")}
        />
        <UmpireDetailRow
          label="Action Address"
          value={maybeString(rawData, "action")}
        />
        <UmpireDetailRow
          label="Activation Date"
          value={maybeDate(rawData, "activationDate")}
        />
        <UmpireDetailRow
          label="Deadline Date"
          value={maybeDate(rawData, "timeoutDate")}
        />
        <UmpireDetailRow
          label="Created at"
          value={maybeDate(rawData, "createdAt")}
        />
      </Box>
    </Layout>
  );
};

export default JobDetails;
