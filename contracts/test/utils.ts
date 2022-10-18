import { BigNumber } from 'ethers';
import { PostfixNodeOperator, PostfixNodeType } from '../enums';
import { PostfixNodeStruct } from '../typechain-types/POC1.sol/POC1';

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
export const pfVariable = (variableIndex: number) => getNode(0, PostfixNodeType.VARIABLE);
export const pfOperator = (operator: keyof typeof pfOperatorMap) =>
  getNode(0, PostfixNodeType.OPERATOR, pfOperatorMap[operator]);
