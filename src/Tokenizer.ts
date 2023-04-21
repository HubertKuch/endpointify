import {RESERVED_KEYWORDS, Token, TokenType} from "./helpers";
import * as os from "os";
import CharsUtils from "./utils/CharsUtils";

export default class Tokenizer {

    public static tokenize(source: string): Array<Array<Token>> {
        const tokens: Array<Array<Token>> = new Array<Array<Token>>();
        const lines: string[] = source.split(os.EOL);

        for (const line of lines) {
            tokens.push(this.tokenizeLine(line));
        }

        return tokens;
    }

    private static tokenizeLine(line: string): Array<Token> {
        const chars: string[] = line.split("");
        const lineTokens: Token[] = new Array<Token>();

        while (chars.length > 0) {
            if (CharsUtils.isEmpty(chars[0])) {
                chars.shift();
            } else if (chars[0] === "{") {
                lineTokens.push({type: TokenType.OPEN_CURLY_BRACES, value: chars.shift() as string});
            } else if (chars[0] === "}") {
                lineTokens.push({type: TokenType.CLOSE_CURLY_BRACES, value: chars.shift() as string});
            } else if (chars[0] === ";") {
                lineTokens.push({type: TokenType.DELIMITER, value: chars.shift() as string});
            } else if (CharsUtils.isLetter(chars[0])) {
                lineTokens.push(this.tokenizeIdentifier(chars));
            } else {
                chars.shift();
            }
        }

        lineTokens.push({ type: TokenType.EOF, value: os.EOL })

        return lineTokens;
    }

    private static tokenizeIdentifier(chars: string[]): Token {
        let identifier: string = "";

        while (chars.length > 0 && CharsUtils.isLetter(chars[0])) {
            CharsUtils.isLetter(chars[0]);
            identifier += chars.shift();
        }

        const keyword: TokenType | undefined = RESERVED_KEYWORDS[identifier];

        if (keyword === undefined) {
            return {type: TokenType.IDENTIFIER, value: identifier};
        } else {
            return {type: keyword, value: identifier};
        }
    }
}
