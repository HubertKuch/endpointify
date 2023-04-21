import {LineWithItemAndModel, Token, TokenType} from "./helpers";

export class Parser {
    private static findNextTokenOfType(tokens: Token[][], type: TokenType): LineWithItemAndModel | undefined {
        for (let line = 0; line < tokens.length; line++){
            const inlineTokens = tokens[line];

            for (let item = 0; item < inlineTokens.length; item++){
                const token = inlineTokens[item];

                if (token.type === type) {
                    return {line, item, token};
                }
            }
        }

        return undefined;
    }

    private static getTokensBetweenLinesAndTokens(tokens: Token[][], startLine: number, startToken: number, endLine: number, endToken: number): Token[] {
        tokens = tokens.filter((inlineTokens, index) => index >= startLine && index <= endLine);

        tokens[0] = tokens[0].filter((items, index) => index >= startToken);
        tokens[tokens.length - 1] = tokens[tokens.length - 1].filter((items, index) => index <= endToken);

        return tokens.flatMap(items => items);
    }
}
