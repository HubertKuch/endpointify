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

        const tokens: Token[][] = Tokenizer.tokenize(source);

        expect(tokens).to.be.not.null;
        expect(tokens[0][3].value).to.be.eq("USER");
        expect(tokens[0][4].value).to.be.eq("ADMIN");
    });

    it('should tokenize enum no cases', function () {
        const source: string = "enum UserRole {}";

        const tokens: Token[][] = Tokenizer.tokenize(source);

        expect(tokens).to.be.not.empty;
    });

    it('should tokenize enum with semicolon', function () {
        const source: string = "enum UserRole { USER; ADMIN; }";

        const tokens: Token[][] = Tokenizer.tokenize(source);

        expect(tokens).to.be.not.empty;
        expect(tokens[0][3].value).to.be.eq("USER");
        expect(tokens[0][5].value).to.be.eq("ADMIN");
    });

    it('should tokenize platform statement with two language identifiers', function () {
        const source: string = `
            platform {
                java {
                    container org.hubert.models.user;                    
                    
                    decorates {
                        Id as javax.persistence.Id;                    
                    }
                }
                typescript {
                    container User;
                    
                    decorates {
                        Id as ignore;
                    }
                }
            }
        `;

        const tokens: Token[][] = Tokenizer.tokenize(source);
        const flatTokens: Token[] = tokens.flatMap(tokens => tokens);
        const platform: Token = flatTokens.find(token => token.type === TokenType.PLATFORM);

        const java: Token = flatTokens.find(token => token.type === TokenType.IDENTIFIER && token.value === "java");
        const typescript: Token = flatTokens.find(token => token.type === TokenType.IDENTIFIER && token.value === "typescript");

        expect(tokens).is.a('array').is.not.null;

        expect(platform).is.not.null;
        expect(java).is.not.null;
        expect(typescript).is.not.null;
    });
})