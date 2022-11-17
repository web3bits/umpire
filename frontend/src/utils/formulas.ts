import {
  getOperatorPrecedence,
  isRightAssociative,
  OperatorSymbol,
  pfOperator,
  pfOperatorMap,
  pfValueSD59x18, pfVariable,
  PostfixNodeOperator,
  PostfixNodeStruct,
} from "./model";

type InfixOperator = PostfixNodeOperator | "(" | ")";

function isValue(node: string): boolean {
  return !!node.match(/^\d+[.,]?\d*$/);
}

function isVariable(node: string): boolean {
  return !!node.match(/^\[\d+]$/g);
}

function shouldPushOperator(
  stack: InfixOperator[],
  currentOperator: PostfixNodeOperator
): boolean {
  if (!stack.length) {
    return false;
  }

  const topOperator = stack[stack.length - 1];

  // parenthesis
  if (typeof topOperator === "string") {
    return false;
  }

  // @todo arity

  const topOperatorPrecedence = getOperatorPrecedence(topOperator);
  const currentOperatorPrecedence = getOperatorPrecedence(currentOperator);

  if (topOperatorPrecedence > currentOperatorPrecedence) {
    return true;
  }

  return (
    topOperatorPrecedence === currentOperatorPrecedence &&
    !isRightAssociative(topOperator)
  );
}

export function infixToPostfix(input: string): PostfixNodeStruct[] {
  const formula: PostfixNodeStruct[] = [];
  const operatorStack: InfixOperator[] = [];

  // @todo add other operators like sqrt
  const infixRegex = /(\d+\.\d+)|(\d+,\d+)|(\d+)|(\[\d+])|([+\-*\/^])|(\s*)/gm;

  // Divide input string into nodes
  const infixNodes = (input?.match(infixRegex) || []).filter(
    (node: string) => node && !node.match(/^\s+$/gm)
  );

  // Convert infix to postfix with shunting yard algorithm
  for (const node of infixNodes) {
    if (isValue(node)) {
      formula.push(pfValueSD59x18(parseFloat(node)));
      continue;
    }

    if (isVariable(node)) {
      formula.push(pfVariable(parseInt(node.replace(/\D/g, ''), 10) - 1));
      continue;
    }

    const operator = pfOperatorMap[node as OperatorSymbol];
    if (typeof operator !== "undefined") {
      while (shouldPushOperator(operatorStack, operator)) {
        const poppedOperator = operatorStack.pop()!;
        if (typeof poppedOperator === "string") {
          throw new Error("Unexpected parenthesis");
        }

        formula.push(pfOperator(poppedOperator));
      }

      operatorStack.push(operator);
      continue;
    }

    if (node === "(") {
      operatorStack.push(node);
      continue;
    }

    if (node === ")") {
      while (operatorStack[operatorStack.length - 1] !== "(") {
        if (!operatorStack.length) {
          throw Error("Missing parenthesis");
        }

        formula.push(pfOperator(operatorStack.pop() as PostfixNodeOperator));
      }

      operatorStack.pop();

      continue;
    }

    throw new Error(`Unknown node ${node}`);
  }

  while (operatorStack.length) {
    const operator = operatorStack[operatorStack.length - 1];

    if (typeof operator === "string") {
      throw Error("Mismatched parentheses");
    }

    formula.push(pfOperator(operatorStack.pop() as PostfixNodeOperator));
  }

  return formula;
}
