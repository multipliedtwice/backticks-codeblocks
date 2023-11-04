import { processText } from '.';

describe('processText', () => {
  it('should convert block code to preformatted text', () => {
    const input = `\`\`\`requiredDependency.mockImplementationOnce(() => {
        throw new Error('Test error');
      });\`\`\``;
    const expectedSegments = [
      {
        code: `requiredDependency.mockImplementationOnce(() => {
        throw new Error('Test error');
      });`,
        isBlock: true,
      },
    ];

    const actualSegments = processText(input);
    expect(actualSegments).toEqual(expectedSegments);
  });

  it('should convert inline and block code correctly', () => {
    const input = `Look at \`this\` code:
    \`\`\`requiredDependency.mockImplementationOnce(() => {
        throw new Error('Test error');
      });\`\`\``;
    const expectedSegments = [
      'Look at ',
      { code: 'this', isBlock: false },
      ' code:\n    ',
      {
        code: `requiredDependency.mockImplementationOnce(() => {
        throw new Error('Test error');
      });`,
        isBlock: true,
      },
    ];

    const actualSegments = processText(input);
    expect(actualSegments).toEqual(expectedSegments);
  });

  it('handles consecutive code blocks', () => {
    const input = 'Check these snippets: ```code1``` then ```code2```';
    const expectedSegments = [
      'Check these snippets: ',
      { code: 'code1', isBlock: true },
      ' then ',
      { code: 'code2', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles nested backticks', () => {
    const input = 'Here is an example `code with `nested` backticks` end';
    const expectedSegments = [
      'Here is an example ',
      {
        code: 'code with ',
        isBlock: false,
      },
      'nested',
      {
        code: ' backticks',
        isBlock: false,
      },
      ' end',
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles interrupted code blocks', () => {
    const input = 'Start ```incomplete code block';
    const expectedSegments = ['Start ```incomplete code block'];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles mixed backticks', () => {
    const input = 'Inline `code` and ```block code``` mixed';
    const expectedSegments = [
      'Inline ',
      { code: 'code', isBlock: false },
      ' and ',
      { code: 'block code', isBlock: true },
      ' mixed',
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles escaped backticks', () => {
    const input = 'This is not `code but \\`escaped backticks\\``';
    const expectedSegments = [
      'This is not ',
      { code: 'code but `escaped backticks`', isBlock: false },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles code block at the start', () => {
    const input = '```code at start``` followed by text';
    const expectedSegments = [
      { code: 'code at start', isBlock: true },
      ' followed by text',
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles code block at the end', () => {
    const input = 'Text followed by ```code at end```';
    const expectedSegments = [
      'Text followed by ',
      { code: 'code at end', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles empty code blocks', () => {
    const input = 'Empty code blocks ``` ``` are weird';
    const expectedSegments = ['Empty code blocks are weird'];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles adjacent code blocks', () => {
    const input = 'No space between```code1``````code2```blocks';
    const expectedSegments = [
      'No space between',
      { code: 'code1', isBlock: true },
      { code: 'code2', isBlock: true },
      'blocks',
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles unmatched backticks inside code blocks', () => {
    const input = '```code with ` inside```';
    const expectedSegments = [{ code: 'code with ` inside', isBlock: true }];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('handles code blocks with new lines', () => {
    const input = 'Multi-line ```\ncode block\n```';
    const expectedSegments = [
      'Multi-line ',
      { code: '\ncode block\n', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });

  it('should complete within acceptable time', () => {
    const text = `
      Start of text.
      Inline \`code\` with more \`inline code\`.
      A code block:
      \`\`\`
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
      \`\`\`
      Text in between.
      Escaped backticks: \`not code\`
      Multiple inline \`codes\` with \`more\` and \`more\` backticks.
      Another \`code block\`:
      \`\`\`
      if (condition) {
        // some comment
        functionCall();
      }
      \`\`\`
      Some final text with \`inline code\` at the end.
    `.repeat(10);
    const iterations = 100;
    const maxTime = 200; // maximum acceptable time in milliseconds

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      processText(text);
    }

    const end = performance.now();
    const duration = end - start;

    console.log(`Total time for ${iterations} iterations: ${duration}ms`);
    console.log(`Average time per iteration: ${duration / iterations}ms`);

    expect(duration).toBeLessThan(maxTime);
  });
});
