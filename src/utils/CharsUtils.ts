export default class CharsUtils {
    public static isLetter(char: string): boolean {
        const asciiCode: number = char.charCodeAt(0);

        return (asciiCode >= 65 && asciiCode <= 90) || (asciiCode >= 97 && asciiCode <= 122);
    }

    public static isEmpty(char: string): boolean {
        const skippableChars: string[] = ["\n", "\r", "\t", " "];

        return skippableChars.includes(char);
    }
}