import {expect} from "chai";
import {Token, TokenType} from "../src/helpers";
import Tokenizer from "../src/Tokenizer";

describe("Tokenizer test", () => {
    it('should return valid model tokens divided by new line char', function () {
        const source: string = `model User {
            string id;
            string name;
        }`;

        const tokens: Token[][] = Tokenizer.tokenize(source);

        expect(tokens).to.be.not.empty;
        expect(Object.values(tokens[0][0])).is.a('array').satisfy((val) => val);
    });

    it('should return valid model tokens in same line', function () {
        const source: string = `model User{string id; string name;}`;

        const tokens: Token[][] = Tokenizer.tokenize(source);

        expect(tokens).to.be.not.empty;
        expect(Object.values(tokens[0][0])).is.a('array').satisfy((val) => val);
    });

    it('should tokenize enum with valid cases', function () {
        const source: string = "enum UserRole { USER ADMIN }";

        const tokens :Token[][] = Tokenizer.tokenize(source);

        expect(tokens).to.be.not.null;
        expect(tokens[0][3].value).to.be.eq("USER");
        expect(tokens[0][4].value).to.be.eq("ADMIN");
    });

    it('should tokenize enum no cases', function () {
        const source: string = "enum UserRole {}";

        const tokens :Token[][] = Tokenizer.tokenize(source);

        expect(tokens).to.be.not.empty;
    });

    it('should tokenize enum with semicolon', function () {
        const source: string = "enum UserRole { USER; ADMIN; }";

        const tokens :Token[][] = Tokenizer.tokenize(source);

        expect(tokens).to.be.not.empty;
        expect(tokens[0][3].value).to.be.eq("USER");
        expect(tokens[0][5].value).to.be.eq("ADMIN");
    });
})