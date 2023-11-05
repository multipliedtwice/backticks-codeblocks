export interface CodeSegment {
    code: string;
    isBlock: boolean;
}
export declare const processText: (text: string) => (string | CodeSegment)[];
