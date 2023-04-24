import {TokenType} from "../helpers";

export enum PropertyType {
    PROPERTY,
    ENUM_CASE
}

export interface Property {
    name: string;
    type: PropertyType;
    propertyType?: string;
    nullable: boolean;
}

export interface ASTNode {
    type: ASTNodeType;
    kind: TokenType;
    value: string;
    body?: ASTNode | ASTNode[];
    properties?: Property[];
}

export enum ASTNodeType {
    MAIN,
    ENUM_CASE_DECLARATION,
    STATEMENT,
    MODEL_DECLARATION
}
