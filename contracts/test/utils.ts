import { BigNumber } from 'ethers';
import { PostfixNodeOperator, PostfixNodeType } from '../enums';
import { PostfixNodeStruct } from '../typechain-types/contracts/UmpireFormulaResolver';
import { toBn } from 'evm-bn';

const pfOperatorMap = {
  '+': PostfixNodeOperator.ADD,
  '-': PostfixNodeOperator.SUB,
  '*': PostfixNodeOperator.MUL,
  '/': PostfixNodeOperator.DIV,
  '%': PostfixNodeOperator.MOD,
  '^': PostfixNodeOperator.POW,
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
export const pfValueSD59x18 = (value: BigNumber | number) => getNode(toBn(String(Number(value))));
export const pfVariable = (variableIndex: number) => getNode(0, PostfixNodeType.VARIABLE, 0, variableIndex);
export const pfOperator = (operator: keyof typeof pfOperatorMap) =>
  getNode(0, PostfixNodeType.OPERATOR, pfOperatorMap[operator]);
export const numToSD59x18 = (value: BigNumber | number) => toBn(String(value));
