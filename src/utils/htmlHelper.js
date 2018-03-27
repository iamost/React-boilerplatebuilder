import { isEmpty } from 'lodash';

const fontSizeForComputation = 100;

const TokenType = {
  text: 0,
  openingTag: 1,
  closingTag: 2,
  emptyTag: 3,
  whitespace: 4,
  entity: 5,
};

const TokenizerState = {
  default: 0,
  inTag: 1,
  inQuotes: 2,
  inApostrophes: 3,
  inEntity: 4,
};

const convertPxValues = (html, conversionValue) => {
  const props = ['width', 'height'];
  var result = html;

  for (let prop of props) {
    const regex = createInlinePropertyRegex(prop, 'px');

    result = result.replace(regex, (match, b, c, d) => {
      return `${b}${parseFloat(c) * 0.352778 * conversionValue}${d}`;
    });
  }

  return result;
};

const createInlinePropertyRegex = (name, unit) => {
  return new RegExp(`("[^"]*${name}:\\s*)(\\d+\\.?\\d*)(${unit}[^"]*")`, 'g');
};

const extractTagName = textInTag => {
  var s = textInTag.trim().toLowerCase();

  if (s.startsWith('/')) {
    s = s.substring(1, s.length);
  }

  const index = s.indexOf(' ');

  if (index >= 0) {
    return s.substring(0, index);
  } else {
    return s.toString();
  }
};

class Token {
  constructor(startIndex, endIndex, type, tagName, entity) {
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.type = type;
    this.tagName = tagName || null;
    this.entity = entity || null;
  }
}

const tokenizeContent = content => {
  const result = [];
  var tokenStart = 0;
  var state = TokenizerState.default;

  for (let index = 0; index < content.length; index++) {
    const c = content.substring(index, index + 1);

    switch (state) {
      case TokenizerState.default:
        switch (c) {
          case '<':
            if (index > tokenStart) {
              result.push(new Token(tokenStart, index, TokenType.text));
            }
            tokenStart = index;
            state = TokenizerState.inTag;
            break;

          case ' ':
            if (index > tokenStart) {
              result.push(new Token(tokenStart, index, TokenType.text));
            }

            result.push(new Token(index, index + 1, TokenType.whitespace));
            tokenStart = index + 1;
            break;

          case '&':
            if (index > tokenStart) {
              result.push(new Token(tokenStart, index, TokenType.text));
            }

            tokenStart = index;
            state = TokenizerState.inEntity;
            break;

          default:
            break;
        }
        break;

      case TokenizerState.inTag:
        switch (c) {
          case '>':
            const textInTag = content.substring(tokenStart + 1, index);
            const tagName = extractTagName(textInTag);
            let tokenType = '';

            if (textInTag.indexOf('/') === 0) {
              tokenType = TokenType.closingTag;
            } else if (textInTag.indexOf('/') === textInTag.length - 1) {
              tokenType = TokenType.emptyTag;
            } else {
              if (tagName === 'br') {
                tokenType = TokenType.emptyTag;
              } else {
                tokenType = TokenType.openingTag;
              }
            }

            result.push(new Token(tokenStart, index + 1, tokenType, tagName));
            tokenStart = index + 1;
            state = TokenizerState.default;

            break;

          case '"':
            state = TokenizerState.inQuotes;
            break;

          case "'":
            state = TokenizerState.inApostrophes;
            break;

          default:
            break;
        }
        break;

      case TokenizerState.inQuotes:
        if (c === '"') {
          state = TokenizerState.inTag;
        }
        break;

      case TokenizerState.inApostrophes:
        if (c === "'") {
          state = TokenizerState.inTag;
        }
        break;

      case TokenizerState.inEntity:
        if (c === ';') {
          result.push(
            new Token(
              tokenStart,
              index + 1,
              TokenType.entity,
              content.substring(tokenStart + 1, index)
            )
          );
          tokenStart = index + 1;
          state = TokenizerState.default;
        } else {
          const n = c[0].toLowerCase();

          if (n < 'a' || n > 'z') {
            result.push(new Token(tokenStart, index, TokenType.text));
            tokenStart = index;
            state = TokenizerState.default;
          }
        }
        break;

      default:
        break;
    }
  }

  if (tokenStart < content.length) {
    result.push(new Token(tokenStart, content.length, TokenType.text));
  }

  return result;
};

const splitHtmlTextOnPages = (
  c,
  fontSizePx,
  pageInnerWidthPx,
  pageInnerHeightPx,
  document,
  ratio
) => {
  const content = convertPxValues(c, ratio);
  const tokens = tokenizeContent(content);
  const lineHeight = computeLineHeight(document);
  const result = [];
  const tagStack = [];
  const letterSpacings = {};
  const letterWidths = {};

  var currentPageHeight = lineHeight;
  var currentLineWidth = 0;
  var pageStartCharIndex = 0;
  var lineStartTokenIndex = 0;

  const addNewPage = (newLineTokenIndex, endIndex) => {
    const pageText =
      content.substring(pageStartCharIndex, endIndex) +
      tagStack
        .reverse()
        .map(it => `</${extractTagName(it)}>`)
        .join('');

    result.push(pageText);
    tagStack.splice(0, tagStack.length);
    pageStartCharIndex = endIndex;
    currentPageHeight = lineHeight;
    currentLineWidth = 0;
    lineStartTokenIndex = newLineTokenIndex;
  };

  const addNewLine = (newLineTokenIndex, endIndex) => {
    const newPageHeight = currentPageHeight + lineHeight;

    if (newPageHeight > pageInnerHeightPx) {
      addNewPage(newLineTokenIndex, endIndex);
    } else {
      currentPageHeight += lineHeight;
      currentLineWidth = 0;
      lineStartTokenIndex = newLineTokenIndex;
    }
  };

  const computeLetterWidth = c => {
    const cachedWidth = letterWidths[c];

    if (cachedWidth != null) {
      return cachedWidth;
    }

    const span = document.createElement('span');

    span.style.fontSize = `${fontSizeForComputation}px`;
    span.innerHTML = c.replace(/ /, '&nbsp;');
    document.body.appendChild(span);

    const letterWidth = span.offsetWidth;
    document.body.removeChild(span);

    const width = letterWidth / (fontSizeForComputation / fontSizePx);
    letterWidths[c] = width;

    return width;
  };

  const computeLetterSpacing = (c1, c2) => {
    const s = `${c1}${c2}`;
    const cachedSpacing = letterSpacings[s];

    if (cachedSpacing != null) {
      return cachedSpacing;
    }

    const span = document.createElement('span');

    span.style.fontSize = `${fontSizeForComputation}px`;
    span.innerHTML = s.replace(' ', '&nbsp;');
    document.body.appendChild(span);

    const pairWidth = span.offsetWidth;
    document.body.removeChild(span);

    const spacing =
      pairWidth / (fontSizeForComputation / fontSizePx) -
      computeLetterWidth(c1) -
      computeLetterWidth(c2);

    letterSpacings[s] = spacing;

    return spacing;
  };

  const computeTextWidth = word => {
    var prevChar = null;
    var textWidth = 0;

    for (let i = 0; i < word.length; i++) {
      const c = word.substring(i, i + 1);
      let spacing = 0;

      if (prevChar != null) {
        spacing = computeLetterSpacing(prevChar, c);
      }

      const width = computeLetterWidth(c);

      textWidth += width + spacing;
      prevChar = c;
    }

    return textWidth;
  };

  const computeTokenizedTextWidth = (s, tokens) => {
    var prevChar = null;
    var textWidth = 0;

    tokens.forEach(token => {
      var textPart = '';

      if (token.type === TokenType.entity) {
        if (token.entity === 'nbsp') {
          textPart = ' ';
        }
      } else {
        textPart = s.substring(token.startIndex, token.endIndex);
      }
      if (
        token.type !== TokenType.openingTag &&
        token.type !== TokenType.closingTag &&
        token.type !== TokenType.emptyTag &&
        textPart
      ) {
        const textPartWidth = computeTextWidth(textPart);
        let spacing = 0;

        if (prevChar != null) {
          const first = textPart.substring(0, 1);
          spacing = computeLetterSpacing(prevChar, first);
        }

        textWidth += textPartWidth + spacing;
        prevChar = textPart.substring(textPart.length - 1, textPart.length);
      }
    });

    return textWidth;
  };

  tokens.forEach((token, index) => {
    switch (token.type) {
      case TokenType.openingTag:
        if (
          token.tagName === 'span' &&
          content
            .substring(token.startIndex, token.endIndex)
            .indexOf('data-page-break') >= 0
        ) {
          addNewPage(index, token.startIndex);
        } else if (
          currentLineWidth > 0 &&
          (token.tagName === 'p' || token.tagName === 'div')
        ) {
          addNewLine(index, token.startIndex);
        }
        tagStack.push(token.tagName);
        break;

      case TokenType.closingTag:
        if (tagStack.length > 0) {
          tagStack.splice(tagStack.size - 1, 1);
        }
        if (token.tagName === 'p' || token.tagName === 'div') {
          addNewLine(index + 1, token.endIndex);
        }
        break;

      case TokenType.emptyTag:
        if (token.tagName === 'br') {
          addNewLine(index + 1, token.endIndex);
        }
        break;

      default:
        const newLineWidth = computeTokenizedTextWidth(
          content,
          tokens.slice(lineStartTokenIndex, index + 1)
        );

        if (newLineWidth > pageInnerWidthPx) {
          addNewLine(index, token.startIndex);
          currentLineWidth = computeTokenizedTextWidth(
            content,
            tokens.slice(index, index + 1)
          );
        } else {
          currentLineWidth = newLineWidth;
        }
    }
  });

  if (pageStartCharIndex < content.length) {
    result.push(content.substring(pageStartCharIndex));
  }

  return result;
};

const computeLineHeight = document => {
  if (!isEmpty(document)) {
    const span = document.createElement('span');

    document.body.appendChild(span);
    span.innerHTML = '<br>';

    const singleLineHeight = span.offsetHeight;

    span.innerHTML = '<br><br>';

    const doubleLineHeight = span.offsetHeight;

    document.body.removeChild(span);

    return doubleLineHeight - singleLineHeight;
  }

  return 0;
};

export default splitHtmlTextOnPages;
