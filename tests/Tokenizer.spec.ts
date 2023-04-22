import {expect} from "chai";
import {Token} from "../src/helpers";
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
})