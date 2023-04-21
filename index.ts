import * as fs from "fs";
import { EOL } from "os";
import {EOF} from "dns";

enum TokenType {
    CONTAINER,
    PLATFORM,
    MODEL,
    DECORATES,
    STRING,
    INT,
    IS,
    NOT,
    NULL,
    EXTENDS,
    IMPROVES,
    DELIMITER,
    OPEN_CURLY_BRACES,
    CLOSE_CURLY_BRACES,
    IDENTIFIER,
    EOF
}

const RESERVED_KEYWORDS: Record<string, TokenType> = {
    "container": TokenType.CONTAINER,
    "platform": TokenType.PLATFORM,
    "model": TokenType.MODEL,
    "decorates": TokenType.DECORATES,
    "string": TokenType.STRING,
    "int": TokenType.INT,
    "is": TokenType.IS,
    "not": TokenType.NOT,
    "null": TokenType.NULL,
    "extends": TokenType.EXTENDS,
    "improves": TokenType.IMPROVES,
}

type Token = {
    body?: Token[];
    type: TokenType;
    name?: string;
    value: string;
};

type LineWithItemAndModel = {
    line: number,
    item: number,
    token: Token
};

class CharsUtils {
    public static isLetter(char: string): boolean {
        const asciiCode: number = char.charCodeAt(0);

        return (asciiCode >= 65 && asciiCode <= 90) || (asciiCode >= 97 && asciiCode <= 122);
    }

    public static isEmpty(char: string): boolean {
        const skippableChars: string[] = ["\n", "\r", "\t", " "];

        return skippableChars.includes(char);
    }
}

class Tokenizer {

    public static tokenize(source: string): Array<Array<Token>> {
        const tokens: Array<Array<Token>> = new Array<Array<Token>>();
        const lines: string[] = source.split(EOL);

        for (const line of lines) {
            tokens.push(this.tokenizeLine(line));
        }

        return tokens;
    }

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

        lineTokens.push({ type: TokenType.EOF, value: EOL })

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

const content: string = fs.readFileSync("sample.model", "utf8");
const tokens: Token[][] = Tokenizer.tokenize(content);

console.log(tokens)
