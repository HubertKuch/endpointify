import {TO_STRING_TYPES_REPRESENTATION, Token, TokenType, TYPES} from "../helpers";
import ASTNode from "../ast/ASTNode";
import SyntaxError from "../exceptions/SyntaxError";

export class Parser {

    public static parseTokens(tokens: Token[][]): ASTNode[] {
        const flatTokens: Token[] = tokens.flatMap(tokens => tokens);
        const astTree: ASTNode[] = [];
        let lineCount = 1;

        type tokenAction = () => ASTNode | undefined;

        const TOKEN_MATCH_ACTIONS: Record<string, tokenAction> = {
            [TokenType.ENUM]: () => this.parseEnum(flatTokens, lineCount),
            [TokenType.MODEL]: () => this.parseModel(flatTokens, lineCount),
            [TokenType.EOF]: () => {
                lineCount++;
                return undefined;
            },
        }

        while (flatTokens.length > 0) {
            const action: tokenAction = TOKEN_MATCH_ACTIONS[flatTokens[0].type];

            if (!action) {
                flatTokens.shift();
                continue;
            }

            const astNode: ASTNode = action();

            if (astNode) {
                astTree.push(astNode);
            }

            flatTokens.shift();
        }

        return astTree;
    }

    private static parseModel(flatTokens: Token[], lineCount: number): ASTNode {
        const name: Token | null = flatTokens[1] ?? null;

        if (!name) {
            throw new SyntaxError("Next token to `model` should be identifier", lineCount);
        }

        const modelBody: Token[] = this.getBodyBetweenCurlyBraces(flatTokens, lineCount);
        const properties: Token[][] = [];

        while (modelBody.length > 0) {
            const indexOfNextProperty: number = modelBody.findIndex((token: Token): boolean => token.type === TokenType.DELIMITER);

            if (indexOfNextProperty === -1 || indexOfNextProperty === 0) {
                break;
            }

            properties.push(modelBody.splice(0, indexOfNextProperty + 1));
        }

        return {
            type: TokenType.MODEL,
            value: name.value,
            properties: properties.map(property => this.parseProperty(property.filter(prop => prop.type !== TokenType.DELIMITER), lineCount))
        }
    }

    private static parseEnum(flatTokens: Token[], lineCount: number): ASTNode {
        const name: Token | null = flatTokens[1] ?? null;

        if (!name || name.type !== TokenType.IDENTIFIER) {
            throw new SyntaxError("Expected enum name. Like `enum UserRole {}`", lineCount);
        }

        const body: Token[] = this.getBodyBetweenCurlyBraces(flatTokens, lineCount, TokenType.IDENTIFIER);

        return {type: TokenType.ENUM, value: name.value, body};
    }

    private static getBodyBetweenCurlyBraces(flatTokens: Token[], lineCount: number, ofType: TokenType = null): Token[] {
        const nextOpenBracesIndex: number = this.findNextTokenOfType(flatTokens, TokenType.OPEN_CURLY_BRACES);
        const nextCloseBracesIndex: number = this.findNextTokenOfType(flatTokens, TokenType.CLOSE_CURLY_BRACES);

        if (nextOpenBracesIndex === -1) {
            throw new SyntaxError("Expected `{` token next to model name", lineCount);
        }

        if (nextCloseBracesIndex === -1) {
            throw new SyntaxError("Expected `}` token next to model body", lineCount);
        }

        return this.getTokensBetweenLinesAndTokens(flatTokens, nextOpenBracesIndex, nextCloseBracesIndex)
            .filter(token => {
                return token.type !== TokenType.OPEN_CURLY_BRACES &&
                    token.type !== TokenType.CLOSE_CURLY_BRACES &&
                    token.type !== TokenType.EOF &&
                    (ofType !== null ? token.type === ofType : true)
            });
    }

    private static parseProperty(plainProperty: Token[], line: number): ASTNode {
        const probablyTypeProp: Token = plainProperty[0];
        const nameProp: Token = plainProperty[1];
        const asProp: Token = plainProperty[2];
        const notProp: Token = plainProperty[3];
        const nullProp: Token = plainProperty[4];

        if (!probablyTypeProp) {
            throw new SyntaxError(`Expected property type, available primitive types are ${TO_STRING_TYPES_REPRESENTATION}`, line);
        }

        const type: TokenType = TYPES[probablyTypeProp.value];

        if (!type) {
            throw new SyntaxError(`Expected property type, available primitive types are ${TO_STRING_TYPES_REPRESENTATION}`, line);
        }

        if (!nameProp || nameProp.type !== TokenType.IDENTIFIER) {
            throw new SyntaxError(`Expected valid property name got ${nameProp?.value ?? 'nothing'}`, line);
        }

        if (asProp && plainProperty.length == 3) {
            throw new SyntaxError("Expected valid extra like `not null` after `as` token", line);
        }

        const extraTokens = [asProp, notProp, nullProp];

        if (!extraTokens.every(prop => prop === null || prop === undefined)) {
            throw new SyntaxError(`Expected valid extra syntax. For example \`as not null\` given \`${plainProperty.reduce((prev, curr) => `${prev}  ${curr.value}`, "")}\``, line);
        }


        return {type, value: nameProp, nullable: !(asProp && notProp && nullProp)};
    }

    private static findNextTokenOfType(tokens: Token[], type: TokenType): number {
        return tokens.findIndex(token => token.type === type);
    }

    private static getTokensBetweenLinesAndTokens(tokens: Token[], startToken: number, endToken: number): Token[] {
        return tokens.filter((token, index) => index >= startToken && index <= endToken);
    }
}
