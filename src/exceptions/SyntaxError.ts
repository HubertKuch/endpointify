export default class SyntaxError extends Error {
    constructor(cause: string, line: number) {
        super(`${cause} on line ${line}`);
    }
}