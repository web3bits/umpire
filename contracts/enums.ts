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
}

export enum UmpireJobStatus {
  NEW,
  REVERTED,
  NEGATIVE,
  POSITIVE
}

export enum UmpireComparator {
  EQUAL,
  NOT_EQUAL,
  GREATER_THAN,
  GREATER_THAN_EQUAL,
  LESS_THAN,
  LESS_THAN_EQUAL
}
