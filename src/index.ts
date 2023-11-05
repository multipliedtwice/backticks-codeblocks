export interface CodeSegment {
  code: string;
  isBlock: boolean;
}

// Components to construct regex for block code segments
const blockStart = '```';
const blockSpaceOptional = '[^\\S\\r\\n]*'; // Matches any space character except newline
const blockContent = '([\\s\\S]*?)'; // Non-greedy match for any character including newlines
const blockEnd = '```';
const blockRegex = new RegExp(blockStart + blockSpaceOptional + blockContent + blockSpaceOptional + blockEnd, 'gs');

// Placeholder for escaped backticks in the text
const escapedTickPlaceholder = "ESC_TICK";

// Regex for inline code segments, excluding backticks as part of other code segments
const inlineRegex = /(?<!`)`(?!`)(.*?)`(?!`)/g;

// A function to perform replace operation
const performReplace = (text: string, regex: RegExp, replacement: string): string => {
  return text.replace(regex, replacement);
};

// Escapes backticks in the text to avoid confusion with code blocks
const escapeBackticks = (text: string): string => {
  return performReplace(text, /\\`/g, escapedTickPlaceholder);
};

// Removes empty code blocks from the text
const replaceEmptyCodeBlocks = (text: string): string => {
  return performReplace(text, /```[\s]*``` /g, '');
};

// A function to perform substring operation
const extractSubstring = (text: string, startIndex: number, endIndex?: number): string => {
  return text.substring(startIndex, endIndex);
};

// Processes a regex match and constructs a code segment object
const processSingleMatch = (match: RegExpExecArray, isBlock: boolean): CodeSegment => {
  let codeContent = match[1];
  // If it's not a block, remove single backticks inside the matched content
  if (!isBlock) {
    codeContent = performReplace(codeContent, /`/g, '');
  }
  // Replace the placeholder back to actual backticks
  return {
    code: performReplace(codeContent, new RegExp(escapedTickPlaceholder, 'g'), '`'),
    isBlock,
  };
};

// Appends the remaining text after the last regex match to the segments array
const appendRemainingText = (segments: (string | CodeSegment)[], text: string, startIndex: number) => {
  if (startIndex < text.length) {
    segments.push(extractSubstring(text, startIndex));
  }
};

// Extracts and appends text segments between code segments to the array
const extractTextSegment = (segments: (string | CodeSegment)[], text: string, startIndex: number, endIndex: number) => {
  if (startIndex < endIndex) {
    segments.push(extractSubstring(text, startIndex, endIndex));
  }
};

// Processes a single match and appends it to the segments array
const processMatchAndAppend = (segments: (string | CodeSegment)[], match: RegExpExecArray, isBlock: boolean) => {
  segments.push(processSingleMatch(match, isBlock));
};

// Iterates over all matches of the regex in the given text and processes them
const iterateMatches = (regex: RegExp, isBlock: boolean, text: string): (string | CodeSegment)[] => {
  const segments: (string | CodeSegment)[] = [];
  let match;
  let lastIndex = 0;

  // Loop through all matches of the regex and process each one
  while ((match = regex.exec(text)) !== null) {
    extractTextSegment(segments, text, lastIndex, match.index);
    processMatchAndAppend(segments, match, isBlock);
    lastIndex = regex.lastIndex;
  }

  // Append any text after the last match
  appendRemainingText(segments, text, lastIndex);
  return segments;
};

// Type guard to check if a segment is a string
const isStringSegment = (segment: string | CodeSegment): segment is string => {
  return typeof segment === 'string';
};

// A function to check if a string segment is non-empty
const isNonEmpty = (segment: string): boolean => {
  return segment.trim() !== '';
};

// Check if the segment is a non-empty string
const isNonEmptyString = (segment: string | CodeSegment): boolean => {
  return isStringSegment(segment) && isNonEmpty(segment);
};

// Check if the segment is a non-empty code segment
const isNonEmptyCodeSegment = (segment: string | CodeSegment): boolean => {
  return !isStringSegment(segment) && isNonEmpty(segment.code);
};

// Process a segment based on its type
const processSegment = (segment: string | CodeSegment): (string | CodeSegment)[] => {
  // If it's a string, process further matches; otherwise, return as is
  return isStringSegment(segment) ? iterateMatches(inlineRegex, false, segment) : [segment];
};

// Filter function to remove empty segments
const filterEmpty = (segment: string | CodeSegment): boolean => {
  return isNonEmptyString(segment) || isNonEmptyCodeSegment(segment);
};

// Main function to process text into code segments
export const processText = (text: string): (string | CodeSegment)[] => {
  // Step 1: Escape backticks in the text
  text = escapeBackticks(text);
  // Step 2: Replace empty code blocks
  text = replaceEmptyCodeBlocks(text);
  // Step 3: Process block code segments
  const blockSegments = iterateMatches(blockRegex, true, text);
  // Step 4: Further process for inline code and filter out empty segments
  return blockSegments.filter(filterEmpty).flatMap(processSegment);
};