// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./UmpireModel.sol";
import "@prb/math/contracts/PRBMathSD59x18.sol";
//import "hardhat/console.sol";

// @todo natspec
contract UmpireFormulaResolverV2 {
    using PRBMathSD59x18 for int;
    function resolve(PostfixNode[] memory _postfixNodes, int[] memory _variables) public pure returns (int) {
        require(_postfixNodes.length > 0, "Provide nodes");

        int[] memory stack = new int[](256);
        uint8 stackHeight;
        for (uint idx = 0; idx < _postfixNodes.length; idx++) {
            if (_postfixNodes[idx].nodeType == PostfixNodeType.VARIABLE) {
                _postfixNodes[idx].nodeType = PostfixNodeType.VALUE;
                _postfixNodes[idx].value = _variables[_postfixNodes[idx].variableIndex];
            }

            if (_postfixNodes[idx].nodeType == PostfixNodeType.VALUE) {
                stack[stackHeight] = _postfixNodes[idx].value;
                stackHeight++;
                continue;
            }

            if (_postfixNodes[idx].nodeType != PostfixNodeType.OPERATOR) {
                revert("Broken node");
            }

            if (_postfixNodes[idx].operator == PostfixNodeOperator.ADD) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 2] + stack[stackHeight - 1];
                stack[stackHeight - 2] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.SUB) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 2] - stack[stackHeight - 1];
                stack[stackHeight - 2] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.MUL) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 2].mul(stack[stackHeight - 1]);
                stack[stackHeight - 2] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.DIV) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                if (stack[stackHeight - 1] == 0) {
                    revert("Division by 0");
                }
                int result = stack[stackHeight - 2].div(stack[stackHeight - 1]);
                stack[stackHeight - 2] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.MOD) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 2] % stack[stackHeight - 1];
                stack[stackHeight - 2] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.POW) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 2].pow(stack[stackHeight - 1]);
                stack[stackHeight - 2] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.LOG2) {
                if (stackHeight < 1) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 1].log2();
                stack[stackHeight - 1] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.LOG10) {
                if (stackHeight < 1) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 1].log10();
                stack[stackHeight - 1] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.LN) {
                if (stackHeight < 1) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 1].ln();
                stack[stackHeight - 1] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.SQRT) {
                if (stackHeight < 1) {
                    revert("Broken stack");
                }
                int result = stack[stackHeight - 1].sqrt();
                stack[stackHeight - 1] = result;
                stackHeight--;
            } else {
                revert("Unknown operator");
            }
        }

        if (stackHeight != 1) {
            revert("Broken stack");
        }

        return stack[0];
    }

    // @dev supports up to 10 values and 10 variables
    // @dev formula format is postfix, variable and value indexes prefixed with X and V
    // @dev example formula: V0V1+
    function stringToNodes(string memory _formula, int[] memory _values) public pure returns (PostfixNode[] memory) {
        bytes memory chars = bytes(_formula);
        uint symbolCount = chars.length;
        for (uint idx = 0; idx < chars.length; idx++) {
            if (chars[idx] == 'V' || chars[idx] == 'X') {
                symbolCount--;
            }
        }

        bool isValue = false;
        bool isVariable = false;
        PostfixNode[] memory nodes = new PostfixNode[](symbolCount);
        uint8 nodeIdx = 0;

        for (uint idx = 0; idx < chars.length; idx++) {
            if (chars[idx] == 'V') {
                isValue = true;
                continue;
            }

            if (chars[idx] == 'X') {
                isVariable = true;
                continue;
            }

            if (isValue) {
                isValue = false;
                nodes[nodeIdx] = PostfixNode(_values[uint8(chars[idx]) - 48], PostfixNodeType.VALUE, PostfixNodeOperator.ADD, 0);
                nodeIdx++;
            } else if (isVariable) {
                isVariable = false;
                nodes[nodeIdx] = PostfixNode(0, PostfixNodeType.VARIABLE, PostfixNodeOperator.ADD, uint8(chars[idx]) - 48);
                nodeIdx++;
            } else if (chars[idx] == '+') {
                nodes[nodeIdx] = PostfixNode(0, PostfixNodeType.OPERATOR, PostfixNodeOperator.ADD, 0);
                nodeIdx++;
            } else {
                revert("Not implemented");
            }
        }

        return nodes;
    }

    function resolveFormula(string memory _formula, int[] memory _values, int[] memory _variables) public pure returns (int) {
        return resolve(stringToNodes(_formula, _values), _variables);
    }
}
