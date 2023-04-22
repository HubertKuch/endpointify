export enum TokenType {
    CONTAINER,
    PLATFORM,
    MODEL,
    ENUM,
    DECORATES,
    STRING,
    INT,
    AS,
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

export const TYPES: Record<string, TokenType> = {
    "int": TokenType.INT,
    "string": TokenType.STRING,
};

export const TO_STRING_TYPES_REPRESENTATION = "<" + (Object.keys(TYPES).reduce((prev, curr) => `${prev} ${curr}`, "").trim()) + ">";

export const RESERVED_KEYWORDS: Record<string, TokenType> = {
    "container": TokenType.CONTAINER,
    "platform": TokenType.PLATFORM,
    "model": TokenType.MODEL,
    "decorates": TokenType.DECORATES,
    "string": TokenType.STRING,
    "int": TokenType.INT,
    "as": TokenType.AS,
    "not": TokenType.NOT,
    "null": TokenType.NULL,
    "extends": TokenType.EXTENDS,
    "improves": TokenType.IMPROVES,
};
