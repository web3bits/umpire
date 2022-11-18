import { BigNumber } from "ethers";
import { fromBn } from "evm-bn";
import dayjs from "dayjs";
import { PostfixNodeStruct, PostfixNodeType } from "./model";
import {
  POLYGON_MUMBAI_COMMODITIES_ITEMS,
  POLYGON_MUMBAI_CRYPTO_ITEMS,
  POLYGON_MUMBAI_EQUITIES_ITEMS,
  POLYGON_MUMBAI_FOREX_ITEMS,
  POLYGON_MUMBAI_META,
} from "../constants/polygon-mumbai";

export const formatOperator = (input: any): string => {
  const i = b2n(input);
  switch (i) {
    case 0:
      return "+";
    case 1:
      return "-";
    case 2:
      return "*";
    case 3:
      return "/";
    case 4:
      return "%";
    case 5:
      return "^";
    case 6:
      return "[log10]";
    case 7:
      return "[log2]";
    case 8:
      return "[ln]";
    case 9:
      return "[sqrt]";
  }
  return "?";
};

export const formatJobStatus = (input: any): string => {
  const i = b2n(input);
  switch (i) {
    case 0:
      return "NEW";
    case 1:
      return "REVERTED";
    case 2:
      return "NEGATIVE";
    case 3:
      return "POSITIVE";
  }
  return "?";
};

export const formatComparator = (input: any): string => {
  const i = b2n(input);
  switch (i) {
    case 0:
      return "=";
    case 1:
      return "!=";
    case 2:
      return ">";
    case 3:
      return ">=";
    case 4:
      return "<";
    case 5:
      return "<=";
  }
  return "?";
};

export const b2n = (input: any): number => {
  return BigNumber.from(input).toNumber();
};

export const formatBN = (input: BigNumber | number): string => {
  if (typeof input === "number") {
    return String(input);
  }

  return fromBn(input);
};

export const formatTimestamp = (input: BigNumber | number): string => {
  return dayjs(BigNumber.from(input).toNumber() * 1000).format(
    "YYYY/MM/DD HH:mm"
  );
};

export const formatFormula = (
  input: PostfixNodeStruct[],
  dataFeeds: string[] = []
): string => {
  const stack: string[] = [];

  for (const node of input) {
    const nodeType = b2n(node.nodeType) as PostfixNodeType;

    if (nodeType === PostfixNodeType.OPERATOR) {
      const o1 = stack.pop();
      const o2 = stack.pop();
      stack.push(`(${o2}${formatOperator(node.operator)}${o1})`);
    } else {
      if (nodeType === PostfixNodeType.VALUE) {
        stack.push(formatBN(node.value));
      } else {
        const variableId = b2n(node.variableIndex);
        const feedAddress = dataFeeds[variableId];
        const feed = [
          ...POLYGON_MUMBAI_META,
          ...POLYGON_MUMBAI_CRYPTO_ITEMS,
          ...POLYGON_MUMBAI_COMMODITIES_ITEMS,
          ...POLYGON_MUMBAI_EQUITIES_ITEMS,
          ...POLYGON_MUMBAI_FOREX_ITEMS,
        ].find((item) => item.address === feedAddress);
        const variableName = feed?.id
          ? feed.id.replace(/\s/gm, "")
          : String(variableId);
        stack.push(`[${variableName}]`);
      }
    }
  }

  return stack[stack.length - 1];
};
