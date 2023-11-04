interface CodeSegment {
  code: string;
  isBlock: boolean;
}

export function processText(text: string): (string | CodeSegment)[] {
  text = text.replace(/```[\s]*``` /g, '');
  const escapedTickPlaceholder = "ESC_TICK";
  text = text.replace(/\\`/g, escapedTickPlaceholder);
  const blockRegex = /```(?:[^\S\r\n]*(?:\r\n|\r|\n))?([\s\S]*?)(?:\r\n|\r|\n)?```/gs;

  const inlineRegex = /(?<!`)`(?!`)(.*?)`(?!`)/g;

  const segments: (string | CodeSegment)[] = [];

  // Function to process matches and update lastIndex
  const processMatches = (regex: RegExp, isBlock: boolean, inputText: string, startIndex: number) => {
    let match;
    let lastIndex = startIndex;
  
    while ((match = regex.exec(inputText)) !== null) {
      if (lastIndex < match.index) {
        segments.push(inputText.substring(lastIndex, match.index));
      }
  
      let codeContent = match[1];
      // Check for nested backticks within inline code only
      if (!isBlock) {
        codeContent = codeContent.replace(/`/g, ''); // Remove all backticks within inline code
      }
      
      segments.push({
        code: codeContent.replace(new RegExp(escapedTickPlaceholder, 'g'), '`'),
        isBlock,
      });
      lastIndex = regex.lastIndex;
    }
  
    if (lastIndex < inputText.length) {
      segments.push(inputText.substring(lastIndex));
    }
  };

  // First process block code
  processMatches(blockRegex, true, text, 0);

  // Then process remaining text for inline code
  const remainingSegments = segments.slice();
  segments.length = 0; // Clear the segments array to repopulate it

  remainingSegments.forEach(segment => {
    if (typeof segment === 'string') {
      processMatches(inlineRegex, false, segment, 0);
    } else {
      segments.push(segment);
    }
  });

  // Filter out any empty string or code blocks
  return segments.filter(segment =>
    typeof segment === 'string' ? segment.trim() !== '' :
    segment.code.trim() !== ''
  );
}

