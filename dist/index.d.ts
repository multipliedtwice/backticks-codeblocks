interface CodeSegment {
    code: string;
    isBlock: boolean;
}
export declare function processText(text: string): (string | CodeSegment)[];
export {};
