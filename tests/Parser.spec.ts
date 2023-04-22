import {Token} from "../src/helpers";
import Tokenizer from "../src/Tokenizer";
import ASTNode from "../src/ast/ASTNode";
import {Parser} from "../src/parser/Parser";
import {assert, expect} from "chai";
import {throws} from "assert";
import SyntaxError from "../src/exceptions/SyntaxError";

describe('Parser test', function () {
    it('should response valid Abstract Syntax Tree', function () {
        const source: string = `model User { string name; int age; }`;

        const tokens: Token[][] = Tokenizer.tokenize(source);
        const astTree: ASTNode[] = Parser.parseTokens(tokens);

        assert.isNotNull(astTree);
        expect(astTree).is.a('array').not.null;
    });

    it('should thrown syntax error \'cause of missing close curly braces', function () {
        const source: string = `model User { string name; int age;`;

        const tokens: Token[][] = Tokenizer.tokenize(source);

        throws(() => Parser.parseTokens(tokens), SyntaxError)
    });

    it('should thrown syntax error \'cause of missing type', function () {
        const source: string = `model User { string name; age; }`;

        const tokens: Token[][] = Tokenizer.tokenize(source);

        throws(() => Parser.parseTokens(tokens), SyntaxError)
    });

    it('should thrown syntax error \'cause of missing property name', function () {
        const source: string = `model User { string name; int ; }`;

        const tokens: Token[][] = Tokenizer.tokenize(source);

        throws(() => Parser.parseTokens(tokens), SyntaxError)
    });
});