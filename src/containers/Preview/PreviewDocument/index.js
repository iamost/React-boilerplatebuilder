import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import _ from "lodash";
import splitHtmlTextOnPages from "../../../utils/htmlHelper";

class PreviewDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      freezeScroll: false
    };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.document !== this.props.document;
  }
  componentDidUpdate(props) {
    if (!this.iframe) {
      this.iframe = ReactDOM.findDOMNode(this);
      this.iframe.contentDocument.head.innerHTML = this.renderStyles();

      const frameBody = this.iframe.contentDocument.body;
      const el = document.createElement("div");

      frameBody.className = "html-preview";
      frameBody.style.cssText = `font-family: 'Times New Roman', serif; font-size: 21.478771699861046px; line-height: 1.25; margin: 0; position: relative; -ms-overflow-style: none; background-color: #104747;`;
      frameBody.appendChild(el);

      this.iframe.contentDocument.addEventListener(
        "scroll",
        _.throttle(this.handleScroll, 50)
      );
      this.iframe.contentWindow.addEventListener(
        "resize",
        _.debounce(this.renderContentDocument, 100)
      );

      this.el = el;
    }

    if (props.document !== this.props.document) {
      this.renderContentDocument();
      setTimeout(() => this.renderContentDocument(), 500);
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.iframe) {
      if (newProps.anchor !== this.props.anchor) {
        if (newProps.anchor) {
          this.iframe.contentDocument.scrollingElement.scrollTop = this.getOffsetTop(
            `selection-header-${newProps.anchor}`
          );
        }
      } else {
        if (newProps.scrollPercent !== this.props.scrollPercent) {
          const height =
            this.iframe.contentDocument.scrollingElement.scrollHeight -
            this.iframe.contentDocument.scrollingElement.clientHeight;
          this.iframe.contentDocument.scrollingElement.scrollTop =
            newProps.scrollPercent / 100 * height;
        }
      }
    }
  }

  getOffsetTop = id => {
    const anchor = this.iframe.contentDocument.getElementById(id);

    if (anchor) {
      let offsetTop = anchor.offsetTop;
      let offsetParent = anchor.offsetParent;

      while (offsetParent) {
        offsetTop += offsetParent.offsetTop;
        offsetParent = offsetParent.offsetParent;
      }

      return offsetTop;
    }

    return this.iframe.contentDocument.scrollingElement.scrollTop;
  };

  makeIndex(level) {
    return level.join(".");
  }

  makeTitle = selection => {
    return `${this.makeIndex(selection.level)} ${selection.title}`;
  };

  formatDate(timestamp) {
    const date = new Date(parseInt(timestamp, 10));

    if (isNaN(date)) {
      return "";
    }

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getYear() - 100}`;
  }

  isChild(parentLevel, childLevel) {
    if (
      parentLevel.length >= childLevel.length ||
      (parentLevel.length === 0 && childLevel.length > 1)
    ) {
      return false;
    }

    for (let i = 0; i < parentLevel.length; i++) {
      if (parentLevel[i] !== childLevel[i]) {
        return false;
      }
    }
    return true;
  }

  substituteVariables = textBlock => {
    for (let setting in this.props.document.settings) {
      const value = this.props.document.settings[setting];

      textBlock = textBlock.replace(
        new RegExp(`\\[${setting}\\]`, "gi"),
        `<span style="background-color: #ecd58c;" data-variable="${setting}" data-value="${value}" class="variable">${value}</span>`
      );
    }

    textBlock = textBlock.replace(
      new RegExp(`(\\[([a-z0-9 _-]+)\\])`, "gi"),
      '<span style="background-color: #ecd58c;" data-variable="$2" class="variable">$1</span>'
    );

    return textBlock;
  };

  parseChildren(level = []) {
    const { selections } = this.props.document;
    const copies = Object.keys(selections || {}).map(key => ({
      ...selections[key],
      index: this.makeIndex(selections[key].level),
      textBlocks: selections[key].textBlocks.map(textBlock =>
        this.substituteVariables(textBlock)
      )
    }));

    const children = copies.filter(selection =>
      this.isChild(level, selection.level)
    );

    return children.sort(
      (a, b) => (this.makeIndex(a.level) > this.makeIndex(b.level) ? 1 : -1)
    );
  }

  parseSelections() {
    const pages = this.parseChildren();

    for (let page of pages) {
      page.children = this.parseChildren(page.level);
    }

    return pages;
  }

  sortSelections() {
    const selections = Object.keys(this.props.document.selections || {}).map(
      key => this.props.document.selections[key]
    );
    return selections.sort(
      (a, b) => (this.makeIndex(a.level) > this.makeIndex(b.level) ? 1 : -1)
    );
  }

  handleScroll = e => {
    const height =
      this.iframe.contentDocument.scrollingElement.scrollHeight -
      this.iframe.contentDocument.scrollingElement.clientHeight;
    const percent =
      this.iframe.contentDocument.scrollingElement.scrollTop / height * 100;
    this.props.onScroll(percent);
  };

  handleMouseMove = e => {
    this.props.onMouseMove(e.clientY + 80);
  };

  handleMouseUp = e => {
    this.props.onMouseUp(e);
  };

  renderStyles = () => {
    return `
      <style type="text/css">@import 'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,600,700';::-webkit-scrollbar { display: none; }html, body {  height: auto !important;}ol, ul {  margin-left: 55.349698934691986px !important;}ul, ul li {  list-style: disc inside !important;}ul li {  list-style-type: disc !important;}ul ul li {  list-style-type: circle !important;}ul ul ul li {  list-style-type: square !important;}ol, ol li {  list-style: none !important;}ol {  counter-reset: level1;}ol li {  display: block;}ol li::before {  content: counter(level1) '.';  counter-increment: level1;  margin-right: 22.139879573876794px;}ol ol {  counter-reset: level2;}ol ol li::before {  content: counter(level2) '.';  counter-increment: level2;}ol ol ol {  counter-reset: level3;}ol ol ol li::before {  content: counter(level3) '.';  counter-increment: level3;}ol ol ol ol {  counter-reset: level4;}ol ol ol ol li::before {  content: counter(level4) '.';  counter-increment: level4;}ol ol ol ol ol {  counter-reset: level5;}ol ol ol ol ol li::before {  content: counter(level5) '.';  counter-increment: level5;}table { font-size: inherit; }</style>  <link type="text/css" rel="stylesheet" href="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/for-html-preview.css">
    `;
  };

  buildFullHtml() {
    const filteredSelections = this.sortSelections();
    let builder = "";

    for (let i in filteredSelections) {
      const index = parseInt(i, 10);
      const selection = filteredSelections[index];
      const header = selection.level.join(".") + " " + selection.title;
      if (selection.title) {
        builder += `<br><p id="selection-header-${
          selection.id
        }"><strong>${header}</strong></p><br>`;
      }

      builder += selection.textBlocks
        .map(this.substituteVariables)
        .join("<br>");
      builder += "<br>";

      if (
        index < filteredSelections.length - 1 &&
        filteredSelections[index].level[0] !==
          filteredSelections[index + 1].level[0]
      ) {
        builder += '<span data-page-break="true" style="display:none"></span>';
      }
    }

    return builder;
  }

  renderContentDocument = () => {
    if (!this.props.document) return;
    // const bodyStyle = this.props.onPage ? { backgroundColor: this.props.htmlPreviewBackgroundColor } : {};
    // const pageVMarginPx = 60;
    const pageLeftMarginPx = 80;
    const pageRightMarginPx = 90;
    // const marginBetweenPagesPx = 10;
    const scrollbarIndentPx = 20;
    const pageWidthMm = 215.9;
    const pageHeightMm = 279.4;
    const pagePaddingMm = 25.4;
    const footerPaddingTopMm = 10;
    const fontSizePt = 11;
    const footerFontSizePt = 9;

    let width =
      (!_.isEmpty(this.iframe.contentDocument) &&
        this.iframe.contentDocument.scrollingElement.clientWidth -
          pageLeftMarginPx -
          pageRightMarginPx -
          scrollbarIndentPx) ||
      100;

    if (this.props.pagesPerRow && this.props.pagesPerRow >= 2) {
      width =
        (!_.isEmpty(this.iframe.contentDocument) &&
          (this.iframe.contentDocument.scrollingElement.clientWidth -
            (pageLeftMarginPx + pageRightMarginPx)) /
            this.props.pagesPerRow) -
          (8 * this.props.pagesPerRow - 1) || 100;
    }
    const height = width / pageWidthMm * pageHeightMm;
    const padding = width / pageWidthMm * pagePaddingMm;
    const fontSize = width / pageWidthMm * (0.352778 * fontSizePt);
    const footerFontSize = width / pageWidthMm * (0.352778 * footerFontSizePt);
    const footerPadding = width / pageWidthMm * footerPaddingTopMm;
    const footerHeight = 4 * footerFontSize + footerPadding;
    const ratio = width / pageWidthMm;

    const pageStyles = {
      position: "relative",
      backgroundColor: "#fff",
      marginLeft: `${pageLeftMarginPx}px`,
      width: `${width}px`,
      height: `${height}px`,
      padding: `${padding}px`,
      boxSizing: "border-box",
      overflow: "hidden"
    };

    const footerStyles = {
      position: "absolute",
      left: `${padding}px`,
      bottom: `${padding}px`,
      fontSize: `${footerFontSize}px`,
      color: "#afafaf",
      lineHeight: "2",
      boxSizing: "border-box"
    };

    const pageNumberStyles = {
      textAlign: "center",
      position: "absolute",
      bottom: `${padding - footerFontSize * 2}px`,
      left: "0",
      right: "0"
    };

    const firstPageStyles = {
      margin: "60px 0 0",
      display: "flex",
      flexDirection: "row"
    };
    const subsequentPageStyles = {
      margin: "10px 0 0",
      display: "flex",
      flexDirection: "row"
    };
    const { document } = this.props;
    const dueDate = this.formatDate(document.dueDate);
    const pages = splitHtmlTextOnPages(
      this.buildFullHtml(),
      fontSize,
      width - padding * 2,
      height - padding * 2 - footerHeight,
      this.iframe.contentDocument,
      ratio
    );

    this.props.onPageCountComplete(pages.length);

    if (!_.isEmpty(this.iframe.contentDocument)) {
      this.iframe.contentDocument.body.style.fontSize = `${fontSize}px`;
    }

    ReactDOM.render(
      <React.Fragment>
        <div
          style={{
            position: "absolute",
            left: "0",
            right: "20px",
            height: "60px",
            top: "-60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "140px",
            paddingRight: "150px",
            fontSize: "10px",
            lineHeight: "1.3",
            fontFamily: "'Open Sans', Arial, sans-serif",
            color: "#5e9090"
          }}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
        >
          {!this.props.hideDisclaimer && (
            <div style={{ textAlign: "center" }}>
              Preview mode is designed to represent a document's appearance in
              Microsoft Word but may result in formatting that is different in
              appearance when exported.
            </div>
          )}
        </div>
        <div
          style={{ marginBottom: "60px" }}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
        >
          {pages.map((page, index) => (
            <div
              style={page === pages[0] ? firstPageStyles : subsequentPageStyles}
              key={index}
            >
              <div className="page" style={pageStyles}>
                <div dangerouslySetInnerHTML={{ __html: page }} />
                <div style={footerStyles}>
                  <p>
                    {document.title}
                    {dueDate && ` | Due Date: ${dueDate}`}
                  </p>
                  {!this.props.hideDisclaimer && (
                    <p style={{ fontStyle: "italic" }}>
                      Use or disclosure of data contained on this page is
                      subject to the restriction on the cover sheet of this
                      proposal.
                    </p>
                  )}
                </div>
                <div style={pageNumberStyles}>{index + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>,
      this.el
    );
  };

  render() {
    return (
      <iframe
        frameBorder="0"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden"
        }}
        title="preview-document"
      />
    );
  }
}

PreviewDocument.propTypes = {
  isDevelopmentMode: PropTypes.bool,
  onPage: PropTypes.bool,
  htmlPreviewBackgroundColor: PropTypes.string,
  cdnUrl: PropTypes.string,
  document: PropTypes.object,
  anchor: PropTypes.string,
  scrollPercent: PropTypes.number,
  onScroll: PropTypes.func,
  onMouseMove: PropTypes.func,
  onPageCountComplete: PropTypes.func
};

export default PreviewDocument;
