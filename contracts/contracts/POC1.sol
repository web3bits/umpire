// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.17;

    enum PostfixNodeType {
        VALUE,
        VARIABLE,
        OPERATOR
    }

    enum PostfixNodeOperator {
        ADD,
        SUB,
        MUL,
        DIV,
        MOD,
        POW
    }

    struct PostfixNode {
        uint value;
        PostfixNodeType nodeType;
        PostfixNodeOperator operator;
        uint8 variableIndex;
    }


// @todo natspec
contract POC1SumArgs {
    function resolve(PostfixNode[] memory _postfixNodes/*, uint[] memory _variables*/) public pure returns (uint) {
        require(_postfixNodes.length > 0, "Provide nodes");

        uint[] memory stack = new uint[](256);
        uint8 stackHeight;
        for (uint idx = 0; idx < _postfixNodes.length; idx++) {
            if (_postfixNodes[idx].nodeType == PostfixNodeType.VARIABLE) {
                _postfixNodes[idx].nodeType = PostfixNodeType.VALUE;
                //                _postfixNodes[idx].value = _variables[_postfixNodes[idx].variableIndex];
            }

            if (_postfixNodes[idx].nodeType == PostfixNodeType.VALUE) {
                stack[stackHeight] = _postfixNodes[idx].value;
                stackHeight++;
                continue;
            }

            if (_postfixNodes[idx].nodeType != PostfixNodeType.OPERATOR) {
                // @todo
                revert("Broken node");
            }

            if (_postfixNodes[idx].operator == PostfixNodeOperator.ADD) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                uint result = stack[stackHeight - 2] + stack[stackHeight - 1];
                stack[stackHeight - 2] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.SUB) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                uint result = stack[stackHeight - 2] - stack[stackHeight - 1];
                stack[stackHeight - 2] = result;
                stackHeight--;
            } else if (_postfixNodes[idx].operator == PostfixNodeOperator.MUL) {
                if (stackHeight < 2) {
                    revert("Broken stack");
                }
                uint result = stack[stackHeight - 2] * stack[stackHeight - 1];
                stack[stackHeight - 2] = result;
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

    function addTwoNumbers(uint _a, uint _b) public pure returns (uint) {
        PostfixNode[] memory nodes = new PostfixNode[](3);
        nodes[0].nodeType = PostfixNodeType.VALUE;
        nodes[0].value = _a;

        nodes[1].nodeType = PostfixNodeType.VALUE;
        nodes[1].value = _b;

        nodes[2].nodeType = PostfixNodeType.OPERATOR;
        nodes[2].operator = PostfixNodeOperator.ADD;

        //        uint[0] memory variables;

        return resolve(nodes/*, variables*/);
    }

    function mulTwoNumbers(uint _a, uint _b) public pure returns (uint) {
        PostfixNode[] memory nodes = new PostfixNode[](3);
        nodes[0].nodeType = PostfixNodeType.VALUE;
        nodes[0].value = _a;

        nodes[1].nodeType = PostfixNodeType.VALUE;
        nodes[1].value = _b;

        nodes[2].nodeType = PostfixNodeType.OPERATOR;
        nodes[2].operator = PostfixNodeOperator.MUL;

        //        uint[0] memory variables;

        return resolve(nodes/*, variables*/);
    }

    function subTwoNumbers(uint _a, uint _b) public pure returns (uint) {
        PostfixNode[] memory nodes = new PostfixNode[](3);
        nodes[0].nodeType = PostfixNodeType.VALUE;
        nodes[0].value = _a;

        nodes[1].nodeType = PostfixNodeType.VALUE;
        nodes[1].value = _b;

        nodes[2].nodeType = PostfixNodeType.OPERATOR;
        nodes[2].operator = PostfixNodeOperator.SUB;

        //        uint[0] memory variables;

        return resolve(nodes/*, variables*/);
    }

    function addThreeNumbers(uint _a, uint _b, uint _c) public pure returns (uint) {
        PostfixNode[] memory nodes = new PostfixNode[](5);
        nodes[0].nodeType = PostfixNodeType.VALUE;
        nodes[0].value = _a;

        nodes[1].nodeType = PostfixNodeType.VALUE;
        nodes[1].value = _b;

        nodes[2].nodeType = PostfixNodeType.OPERATOR;
        nodes[2].operator = PostfixNodeOperator.ADD;

        nodes[3].nodeType = PostfixNodeType.VALUE;
        nodes[3].value = _c;

        nodes[4].nodeType = PostfixNodeType.OPERATOR;
        nodes[4].operator = PostfixNodeOperator.ADD;

        //        uint[0] memory variables;

        return resolve(nodes/*, variables*/);
    }

    function addThenTimes(uint _a, uint _b, uint _c) public pure returns (uint) {
        PostfixNode[] memory nodes = new PostfixNode[](5);
        nodes[0].nodeType = PostfixNodeType.VALUE;
        nodes[0].value = _a;

        nodes[1].nodeType = PostfixNodeType.VALUE;
        nodes[1].value = _b;

        nodes[2].nodeType = PostfixNodeType.VALUE;
        nodes[2].value = _c;

        nodes[3].nodeType = PostfixNodeType.OPERATOR;
        nodes[3].operator = PostfixNodeOperator.MUL;

        nodes[4].nodeType = PostfixNodeType.OPERATOR;
        nodes[4].operator = PostfixNodeOperator.ADD;

        //        uint[0] memory variables;

        return resolve(nodes/*, variables*/);
    }

    function timesThenAdd(uint _a, uint _b, uint _c) public pure returns (uint) {
        PostfixNode[] memory nodes = new PostfixNode[](5);
        nodes[0].nodeType = PostfixNodeType.VALUE;
        nodes[0].value = _a;

        nodes[1].nodeType = PostfixNodeType.VALUE;
        nodes[1].value = _b;

        nodes[2].nodeType = PostfixNodeType.OPERATOR;
        nodes[2].operator = PostfixNodeOperator.MUL;

        nodes[3].nodeType = PostfixNodeType.VALUE;
        nodes[3].value = _c;

        nodes[4].nodeType = PostfixNodeType.OPERATOR;
        nodes[4].operator = PostfixNodeOperator.ADD;

        //        uint[0] memory variables;

        return resolve(nodes/*, variables*/);
    }
}
