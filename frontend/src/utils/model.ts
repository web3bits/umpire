import { BigNumber } from "ethers";
import { toBn } from "evm-bn/dist";

export enum PostfixNodeType {
  VALUE,
  VARIABLE,
  OPERATOR,
}

export enum PostfixNodeOperator {
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
  POW,
  LOG10,
  LOG2,
  LN,
  SQRT,
}

export enum UmpireJobStatus {
  NEW,
  REVERTED,
  NEGATIVE,
  POSITIVE,
}

export enum UmpireComparator {
  EQUAL,
  NOT_EQUAL,
  GREATER_THAN,
  GREATER_THAN_EQUAL,
  LESS_THAN,
  LESS_THAN_EQUAL,
}

const pfOperatorMap = {
  "+": PostfixNodeOperator.ADD,
  "-": PostfixNodeOperator.SUB,
  "*": PostfixNodeOperator.MUL,
  "/": PostfixNodeOperator.DIV,
  "%": PostfixNodeOperator.MOD,
  "^": PostfixNodeOperator.POW,
};

const pfReverseOperatorMap = Object.keys(pfOperatorMap).reduce(
  (map, operator) => {
    return { ...map, [pfOperatorMap[operator as "+" | "-" |  "*" | "/" | "%" | "^"]]: operator };
  },
  {}
);

export type PostfixNodeStruct = {
  value: BigNumber;
  nodeType: PostfixNodeType;
  operator: PostfixNodeOperator;
  variableIndex: number;
};

export const getNode = (
  value: BigNumber | number = 0,
  nodeType: PostfixNodeType = PostfixNodeType.VALUE,
  operator: PostfixNodeOperator = PostfixNodeOperator.ADD,
  variableIndex = 0
): PostfixNodeStruct => {
  return {
    value: BigNumber.isBigNumber(value) ? value : BigNumber.from(value),
    nodeType,
    operator,
    variableIndex,
  };
};

export const pfValue = (value: BigNumber | number) => getNode(value);
export const pfValueSD59x18 = (value: BigNumber | number) =>
  getNode(toBn(String(Number(value))));
export const pfVariable = (variableIndex: number) =>
  getNode(0, PostfixNodeType.VARIABLE, 0, variableIndex);
export const pfOperator = (operator: keyof typeof pfOperatorMap) =>
  getNode(0, PostfixNodeType.OPERATOR, pfOperatorMap[operator]);
export const numToSD59x18 = (value: BigNumber | number) => toBn(String(value));

export interface UmpireJob {
  id: BigNumber | number;
  owner: string;
  jobStatus: UmpireJobStatus;
  formulaLeft: PostfixNodeStruct[];
  comparator: UmpireComparator;
  formulaRight: PostfixNodeStruct[];
  dataFeeds: string[];
  createdAt: number;
  timeoutDate: number;
  activationDate: number;
  action: string;
  leftValue: BigNumber | number;
  rightValue: BigNumber | number;
  jobName: string;
}

export const tupleToJob = (input: any[]): UmpireJob => {
  return {
    id: input[0],
    owner: input[1],
    jobStatus: input[2],
    formulaLeft: tupleToFormula(input[3]),
    comparator: input[4],
    formulaRight: tupleToFormula(input[5]),
    dataFeeds: input[6],
    createdAt: input[7],
    timeoutDate: input[8],
    activationDate: input[9],
    action: input[10],
    leftValue: input[11],
    rightValue: input[12],
    jobName: input[13],
  };
};

export const tupleToFormula = (inputs: any[]): PostfixNodeStruct[] => {
  return inputs.map(
    (input: any[]) =>
      ({
        value: input[0],
        nodeType: input[1],
        operator: input[2],
        variableIndex: input[3],
      } as PostfixNodeStruct)
  );
};
