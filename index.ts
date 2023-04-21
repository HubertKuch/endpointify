import * as fs from "fs";
import Tokenizer from "./src/Tokenizer";

const content: string = fs.readFileSync("sample.model", "utf8");
const tokens = Tokenizer.tokenize(content);

console.log(tokens)
