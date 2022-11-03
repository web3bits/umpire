// SPDX-License-Identifier: MIT
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
    POW,
    LOG10,
    LOG2,
    LN,
    SQRT
}

struct PostfixNode {
    int value;
    PostfixNodeType nodeType;
    PostfixNodeOperator operator;
    uint8 variableIndex;
}

enum UmpireJobStatus {
    NEW,
    REVERTED,
    NEGATIVE,
    POSITIVE
}

enum UmpireComparator {
    EQUAL,
    NOT_EQUAL,
    GREATER_THAN,
    GREATER_THAN_EQUAL,
    LESS_THAN,
    LESS_THAN_EQUAL
}

struct UmpireJob {
    uint id;
    address owner;
    UmpireJobStatus jobStatus;
    PostfixNode[] formulaLeft;
    UmpireComparator comparator;
    PostfixNode[] formulaRight;
    address[] dataFeeds;
    uint createdAt;
    uint timeoutDate;
    uint activationDate;
    address action;
    int leftValue;
    int rightValue;
    string jobName;
}
