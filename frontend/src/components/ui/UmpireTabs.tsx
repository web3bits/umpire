import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel = ({
  children,
  value,
  index,
  id,
}: {
  children: string;
  value: any;
  index: number;
  id: string;
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={id}
      aria-labelledby={`${id}-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (id: string, index: number) => {
  return {
    id: `${id}-props-${index}`,
    "aria-controls": `${id}-props-${index}`,
  };
};

const renderTabPanels = (id: string, value: number, contents: any[]) => {
  return contents?.map((content: any, index: number) => {
    const key = `${id}-tp-${index}`;
    return (
      <TabPanel value={value} index={index} id={key} key={key}>
        {content}
      </TabPanel>
    );
  });
};

const renderTabs = (id: string, tabs: string[]) => {
  return tabs?.map((tab: string, index: number) => {
    const key = `${id}-tab-${index}`;
    return <Tab label={tab} {...a11yProps(id, index)} key={key} />;
  });
};

export const UmpireTabs = ({
  id,
  tabs,
  contents,
  activeTab,
  setActiveTab,
}: {
  id: string;
  tabs: string[];
  contents: any[];
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleChange} id={id}>
          {renderTabs(id, tabs)}
        </Tabs>
      </Box>
      {renderTabPanels(id, activeTab, contents)}
    </Box>
  );
};