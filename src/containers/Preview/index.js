import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "components/Header";
import { connect } from "react-redux";
import {
  getDocument,
  updateSettings,
  searchDocument,
  importFields,
  requestDocument
} from "../../api/modules/document";
import "./styles.scss";
import PreviewSidebar from "./PreviewSidebar";
import PreviewSettingsForm from "./PreviewSettingsForm";
import PreviewDocument from "./PreviewDocument";

class Preview extends Component {
  constructor(props) {
    const { documentId } = props.match.params;
    super(props);
    this.state = {
      documentId,
      anchor: "",
      searchValue: "",
      scrolling: false,
      scrollbarOffset: 0,
      scrollbarPercent: 0,
      iframeScrollPercent: 0,
      totalPages: 0,
      documentFormat: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.documentToken && this.state.documentFormat) {
      const { documentFormat } = this.state;
      this.setState({ documentFormat: "" }, () => {
        if (documentFormat === "autofill") {
          window.location.href = `/autofill/export?token=${nextProps.documentToken}`;
        } else {
          window.location.href = `/export/document/${documentFormat}?token=${nextProps.documentToken}`;
        }
      });
    }

    if (nextProps.document.selections) {
      this.setState({
        totalPages: this.getPageCount(nextProps.document.selections)
      });
    }
  }

  componentDidMount() {
    this.retrieveDocument();
  }

  countSettings() {
    const textBlocks = Object.keys(this.props.document.selections || {}).reduce(
      (previousValue, key) => {
        return previousValue.concat(
          this.props.document.selections[key].textBlocks
        );
      },
      []
    );

    return textBlocks.reduce((previousValue, textBlock) => {
      const settings = textBlock.match(/\[[a-z0-9 _-]+\]/gi);

      if (settings) {
        for (let setting of settings) {
          const trimmed = setting.substring(1, setting.length - 1);

          if (previousValue.hasOwnProperty(trimmed)) {
            previousValue[trimmed]++;
          } else {
            previousValue[trimmed] = 1;
          }
        }
      }

      return previousValue;
    }, {});
  }

  retrieveDocument() {
    const { searchValue } = this.state.searchValue;
    const id = this.state.documentId;

    if (searchValue) {
      this.props.searchDocument({ searchValue });
    } else {
      this.props.getDocument({ documentId: id });
    }
  }

  updateSettings = settings => {
    const success = (res, action) => {
      this.retrieveDocument();
    };

    this.props.updateSettings({
      id: this.state.documentId,
      body: { ...settings },
      success
    });
  };

  handleSearch(e) {
    const searchValue = e.target.value;
    this.setState({ searchValue });
    if (searchValue) this.props.searchDocument({ searchValue });
    else this.props.getDocument({ documentId: this.state.documentId });
  }

  getPageCount(selections) {
    const pages = Object.keys(selections).filter(
      key => selections[key].level.length === 1
    );
    return pages.length;
  }

  makeAnchor(level) {
    return level.join(".");
  }

  importFields = e => {
    this.props.importFields({
      id: this.state.documentId,
      file: e.target.files[0],
      success: () => this.retrieveDocument()
    });
  };

  exportFields = () => {
    this.setState(
      {
        documentFormat: "autofill"
      },
      () => {
        this.props.requestDocument({
          id: this.state.documentId
        });
      }
    );
  };

  exportDocx = e => {
    this.setState(
      {
        documentFormat: "docx"
      },
      () => {
        this.props.requestDocument({
          id: this.state.documentId
        });
      }
    );
  };

  exportPdf = e => {
    this.setState(
      {
        documentFormat: "pdf"
      },
      () => {
        this.props.requestDocument({
          id: this.state.documentId
        });
      }
    );
  };

  updateAnchor = selection => {
    const anchor = selection.id;
    this.setState({ anchor });
  };

  handleScroll = scrollbarPercent => {
    this.setState({ scrollbarPercent });
  };

  startScroll = e => {
    if (this.scrollbar) {
      let scrollbarOffset = this.scrollbar.offsetTop;
      let offsetParent = this.scrollbar.offsetParent;
      const mouseY = e.clientY;

      while (offsetParent) {
        scrollbarOffset += offsetParent.offsetTop;
        offsetParent = offsetParent.offsetParent;
      }

      this.setState(
        { scrolling: true, scrollbarOffset, anchor: "" },
        this.updateScroll(mouseY, scrollbarOffset)
      );
    }
  };

  updateScroll = (mouseY, scrollbarOffset) => {
    if (this.scrollbar) {
      const position = Math.max(
        0,
        Math.min(this.scrollbar.clientHeight, mouseY - scrollbarOffset)
      );
      const scrollbarPercent = Math.max(
        0,
        Math.min(100, position / this.scrollbar.clientHeight * 100)
      );
      const iframeScrollPercent = scrollbarPercent;
      this.setState({ scrollbarPercent, iframeScrollPercent });
    }
  };

  stopScroll = e => {
    if (this.state.scrolling) {
      this.setState({ scrolling: false });
    }
  };

  handleMouseMove = e => {
    if (this.state.scrolling) {
      this.updateScroll(e.clientY, this.state.scrollbarOffset);
    }
  };

  handleIframeMouseMove = mouseY => {
    if (this.state.scrolling) {
      this.updateScroll(mouseY, this.state.scrollbarOffset);
    }
  };

  handlePageCount = totalPages => {
    this.setState({ totalPages });
  };

  findUndeclaredSettings() {
    const textBlocks = Object.keys(this.props.document.selections || {}).reduce(
      (previousValue, key) => {
        return previousValue.concat(
          this.props.document.selections[key].textBlocks
        );
      },
      []
    );

    return textBlocks.reduce((previousValue, textBlock) => {
      const settings = textBlock.match(/\[[a-z0-9 _-]+\]/gi);

      if (settings) {
        for (let setting of settings) {
          const trimmed = setting.substring(1, setting.length - 1);

          if (
            !previousValue.hasOwnProperty(trimmed) &&
            !this.props.document.settings.hasOwnProperty(trimmed)
          ) {
            previousValue[trimmed] = "";
          }
        }
      }

      return previousValue;
    }, {});
  }

  renderMainContent() {
    const {
      anchor,
      scrollbarPercent,
      iframeScrollPercent,
      totalPages
    } = this.state;
    const document = this.state.document || this.props.document;
    const settings = { ...document.settings, ...this.findUndeclaredSettings() };
    const currentPage =
      scrollbarPercent < 100
        ? Math.floor(scrollbarPercent / 100 * totalPages) + 1
        : totalPages;
    const settingCounts = this.countSettings();
    return (
      <div
        className="main hbox space-between preview-page"
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.stopScroll}
      >
        <div style={{ display: "flex" }}>
          <PreviewSidebar {...document} onClick={this.updateAnchor} />
        </div>
        <div
          className="left-section-border"
          style={{ display: "flex", flexDirection: "column", flex: "1 1 0%" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", flex: "1 1 0%" }}
          >
            <div
              id="document-preview-node"
              style={{
                display: "flex",
                flex: "1 1 0%",
                position: "relative",
                overflowX: "hidden",
                backgroundColor: "rgb(16, 71, 71)"
              }}
            >
              <div
                id="document-preview-node-inner"
                style={{
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                  right: "-20px",
                  bottom: "0px",
                  paddingLeft: "10px"
                }}
              >
                <PreviewDocument
                  document={document}
                  anchor={anchor}
                  scrollPercent={iframeScrollPercent}
                  onScroll={this.handleScroll}
                  onMouseMove={this.handleIframeMouseMove}
                  onMouseUp={this.stopScroll}
                  onPageCountComplete={this.handlePageCount}
                />
                <div
                  ref={element => (this.scrollbar = element)}
                  onMouseDown={this.startScroll}
                  style={{
                    position: "absolute",
                    right: "70px",
                    top: "90px",
                    height: "300px",
                    width: "7px",
                    borderRadius: "7px",
                    backgroundColor: "rgb(25, 91, 91)",
                    display: "inline"
                  }}
                >
                  <div
                    className="scroll-thumb"
                    style={{ top: `${scrollbarPercent}%` }}
                  >
                    <div
                      className="scroll-indicator"
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "3px",
                        fontSize: ".75rem",
                        fontFamily: "'Open Sans', Arial, sans-serif",
                        color: "#5e9090"
                      }}
                    >
                      {currentPage}/{totalPages}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ backgroundColor: "rgb(16, 71, 71)", padding: "0px 90px" }}
          >
            <div
              className="bottom-navigation-button"
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center"
              }}
            >
              <span style={{ marginRight: "20px" }}>Export Document:</span>
              <span
                style={{ marginRight: "20px", cursor: "pointer" }}
                onClick={this.exportDocx}
              >
                DOCX
              </span>
              <span
                style={{ marginRight: "20px", cursor: "pointer" }}
                onClick={this.exportPdf}
              >
                PDF
              </span>
            </div>
          </div>
        </div>
        <div
          className="left-section-border"
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 0%",
            maxWidth: "550px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0%",
              padding: "0px 50px",
              backgroundColor: "rgb(248, 248, 248)"
            }}
          >
            <div
              className="left-section-border right-section-border"
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                flex: "1 1 0%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ flex: "1 1 0%", overflowY: "auto" }}>
                <div className="section-header-block">
                  <h1 className="header1">Field Autofill</h1>
                </div>
                <div
                  className="bottom-section-border"
                  style={{
                    padding: "40px 50px",
                    fontSize: "14px",
                    lineHeight: "1.3"
                  }}
                >
                  Use the Field Autofill tool below to quickly fill placeholders
                  with content relevant to your proposal. If fields are not
                  readily available, you can export this list and share with
                  other team members who have that missing content.
                </div>
                <PreviewSettingsForm
                  settings={settings}
                  settingCounts={settingCounts}
                  onSave={this.updateSettings}
                />
              </div>
              <div style={{ display: "flex", width: "100%" }}>
                <form id="autofill-import-file-form">
                  <input
                    id="autofill-import-file-input"
                    type="file"
                    accept=".xlsx"
                    style={{ display: "none" }}
                    onChange={this.importFields}
                  />
                </form>
                <label
                  className="autofill-function-button right-section-border"
                  htmlFor="autofill-import-file-input"
                >
                  Import Fields
                </label>
                <button
                  className="autofill-function-button"
                  onClick={this.exportFields}
                >
                  Export Fields
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="viewport vbox">
        <Header showBuilder={true} />
        {this.renderMainContent()}
        <Link to="/support" className="general-help-button">
          ?
        </Link>
      </div>
    );
  }
}

Preview.propTypes = {
  document: PropTypes.object,
  getDocument: PropTypes.func,
  searchDocument: PropTypes.func,
  updateSettings: PropTypes.func,
  importFields: PropTypes.func,
  requestDocument: PropTypes.func
};

const mapStateToProps = state => {
  const { document, documentToken } = state.document;
  return { document, documentToken };
};

const mapActionToProps = {
  getDocument,
  updateSettings,
  searchDocument,
  importFields,
  requestDocument
};

export default connect(mapStateToProps, mapActionToProps)(Preview);
