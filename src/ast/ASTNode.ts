import {TokenType} from "../helpers";

export default interface ASTNode {
    type: TokenType;
    value: any;
    body?: ASTNode | ASTNode[];
    properties?: ASTNode[];
}