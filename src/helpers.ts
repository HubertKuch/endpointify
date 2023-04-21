export enum TokenType {
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

export type Token = {
    body?: Token[];
    type: TokenType;
    name?: string;
    value: string;
};

export type LineWithItemAndModel = {
    line: number,
    item: number,
    token: Token
};

export const RESERVED_KEYWORDS: Record<string, TokenType> = {
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
