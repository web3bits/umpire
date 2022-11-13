import {BigNumber} from "ethers";
import {fromBn} from "evm-bn";
import dayjs from "dayjs";
import {PostfixNodeStruct, PostfixNodeType} from "./model";

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

export const formatFormula = (input: PostfixNodeStruct[]): string => {
  let formula = "";
  for (const node of input) {
    const nodeType = b2n(node.nodeType) as PostfixNodeType;
    if (nodeType === PostfixNodeType.VALUE) {
      formula += formatBN(node.value) + " ";
    } else if (nodeType === PostfixNodeType.OPERATOR) {
      formula += formatOperator(node.operator) + " ";
    } else {
      formula += `[${b2n(node.variableIndex)}] `;
    }
  }

  return formula;
};
