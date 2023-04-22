import * as fs from "fs";
import Tokenizer from "./src/Tokenizer";
import {Parser} from "./src/parser/Parser";

const content: string = fs.readFileSync("sample.model", "utf8");
const tokens = Tokenizer.tokenize(content);

console.log(Parser.parseTokens(tokens))

// console.log(tokens)
