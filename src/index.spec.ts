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

  it('handles code blocks with language specifiers', () => {
    const input = '```javascript\nconsole.log("hello");\n```';
    const expectedSegments = [
      { code: 'javascript\nconsole.log("hello");\n', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('handles backticks at the start of the text', () => {
    const input = '`code` at the start';
    const expectedSegments = [
      { code: 'code', isBlock: false },
      ' at the start',
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('handles backticks with spaces inside', () => {
    const input = '` code with spaces ` and more text';
    const expectedSegments = [
      { code: ' code with spaces ', isBlock: false },
      ' and more text',
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('handles multiple backticks for emphasis in code', () => {
    const input = '```some ``emphasized`` code```';
    const expectedSegments = [
      { code: 'some ``emphasized`` code', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('handles backticks inside a word', () => {
    const input = 'word`inside`word';
    const expectedSegments = ['word', { code: 'inside', isBlock: false }, 'word'];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('handles multiple lines of code with inline comments', () => {
    const input = '```\nline1\n// inline comment\nline3\n```';
    const expectedSegments = [
      { code: '\nline1\n// inline comment\nline3\n', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('ignores single backticks within code blocks', () => {
    const input = '```code ` with single ` backtick```';
    const expectedSegments = [
      { code: 'code ` with single ` backtick', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('handles mixed content with plaintext and code blocks', () => {
    const input = 'Text, `inline code`, text, ```block code```';
    const expectedSegments = [
      'Text, ',
      { code: 'inline code', isBlock: false },
      ', text, ',
      { code: 'block code', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('differentiates between single line and multi-line code blocks', () => {
    const input = '`single line code` and ```\nmulti-line\ncode\n```';
    const expectedSegments = [
      { code: 'single line code', isBlock: false },
      ' and ',
      { code: '\nmulti-line\ncode\n', isBlock: true },
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

  it('handles language specifiers in code blocks', () => {
    const input = '```javascript\nconsole.log("hello");\n```';
    const expectedSegments = [
      { code: 'javascript\nconsole.log("hello");\n', isBlock: true },
    ];
    expect(processText(input)).toEqual(expectedSegments);
  });
  
  it('treats single backticks within words as apostrophes', () => {
    const input = "It's not a `code` block";
    const expectedSegments = ["It's not a ", { code: 'code', isBlock: false }, " block"];
    expect(processText(input)).toEqual(expectedSegments);
  });

    it('extracts and validates a complex React code block', () => {
      const input = `
  \`\`\`
  /* eslint-disable no-console */
  import Dropdown from 'rc-dropdown';
  import Menu, { Item as MenuItem, Divider } from 'rc-menu';
  import 'rc-dropdown/assets/index.css';
  import React from 'react';
  import ReactDOM from 'react-dom';
  
  function onSelect({ key }) {
    console.log(\`\${key} selected\`);
  }
  
  function onVisibleChange(visible) {
    console.log(visible);
  }
  
  const menu = (
    <Menu onSelect={onSelect}>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem key="1">one</MenuItem>
      <Divider />
      <MenuItem key="2">two</MenuItem>
    </Menu>
  );
  
  ReactDOM.render(
    <div style={{ margin: 20 }}>
      <div style={{ height: 100 }}/>
      <div>
        <Dropdown
          trigger={['click']}
          overlay={menu}
          animation="slide-up"
          onVisibleChange={onVisibleChange}
        >
          <button style={{ width: 100 }}>open</button>
        </Dropdown>
      </div>
    </div>
  , document.getElementById('__react-content'));
  \`\`\`
  `.trim();
  
      const blockRegex = /```((?:.|\r?\n)*?)```/gs;
      const matches = [...input.matchAll(blockRegex)];
      const codeBlocks = matches.map(match => match[1].trim());
  
      // The expected result is the code block as a string without the backticks
      const expectedResult = `
  /* eslint-disable no-console */
  import Dropdown from 'rc-dropdown';
  import Menu, { Item as MenuItem, Divider } from 'rc-menu';
  import 'rc-dropdown/assets/index.css';
  import React from 'react';
  import ReactDOM from 'react-dom';
  
  function onSelect({ key }) {
    console.log(\`\${key} selected\`);
  }
  
  function onVisibleChange(visible) {
    console.log(visible);
  }
  
  const menu = (
    <Menu onSelect={onSelect}>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem key="1">one</MenuItem>
      <Divider />
      <MenuItem key="2">two</MenuItem>
    </Menu>
  );
  
  ReactDOM.render(
    <div style={{ margin: 20 }}>
      <div style={{ height: 100 }}/>
      <div>
        <Dropdown
          trigger={['click']}
          overlay={menu}
          animation="slide-up"
          onVisibleChange={onVisibleChange}
        >
          <button style={{ width: 100 }}>open</button>
        </Dropdown>
      </div>
    </div>
  , document.getElementById('__react-content'));
  `.trim();
  
      expect(codeBlocks).toHaveLength(1);
      expect(codeBlocks[0]).toEqual(expectedResult);
  });
});
