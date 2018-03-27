import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Resizable from "re-resizable";
import PreviewDocument from "../Preview/PreviewDocument";
import { getTemplates, openFolder, moveTemplate } from "api/modules/template";
import Header from "components/Header";
import Templates from "components/Templates";
import FolderModal from "./FolderModal";
import ContentModal from "./ContentModal";
import DeleteModal from "./DeleteModal";

import Wrapper from "./Wrapper";

class Library extends Component {
  state = {
    currentPage: 0,
    totalPages: 0
  };

  componentWillMount() {
    this.props.getTemplates();
  }
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
  handleScroll = scrollbarPercent => {
    this.setState({ scrollbarPercent });
  };
  handleIframeMouseMove = mouseY => {
    if (this.state.scrolling) {
      this.updateScroll(mouseY, this.state.scrollbarOffset);
    }
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
  handlePageCount = totalPages => {
    this.setState({ totalPages });
  };
  showDialog = (kind, item) => this.setState({ dialog: { kind, item } });
  hideDialog = () => this.setState({ dialog: null });
  showPreviewTemplate = info => {
    !info.folder && this.setState({ previewTemplate: { show: true, info } });
  };

  showAddFolderDialog = parentId => {
    this.showDialog("folder", { parentId });
  };

  showAddContentDialog = parentId => {
    this.showDialog("content", { parentId });
  };

  showEditDialog = item => {
    this.showDialog(item.folder ? "folder" : "content", item);
  };

  showDeleteDialog = item => {
    this.showDialog("delete", item);
  };

  updateAnchor = selection => {
    const anchor = selection.id;
    this.setState({ anchor });
  };

  handleScroll = scrollbarPercent => {
    this.setState({ scrollbarPercent });
  };
  handlePageCount = totalPages => {
    this.setState({ totalPages });
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
      console.warn(scrollbarPercent, iframeScrollPercent);
    }
  };

  stopScroll = e => {
    if (this.state.scrolling) {
      this.setState({ scrolling: false });
    }
  };
  handleIframeMouseMove = mouseY => {
    if (this.state.scrolling) {
      this.updateScroll(mouseY, this.state.scrollbarOffset);
    }
  };

  createFromNode(node) {
    if (!node) return this.state.document;
    return {
      selections: {
        [node.id]: {
          level: [1],
          id: node,
          next: null,
          previous: null,
          settings: {},
          title: "",
          textBlocks: [node.text]
        }
      }
    };
  }
  render() {
    const { templates, opens, openFolder, moveTemplate, reuse } = this.props;
    const { dialog, document } = this.state;
    const { kind, item } = dialog || {};

    const {
      anchor,
      scrollbarPercent,
      iframeScrollPercent,
      totalPages
    } = this.state;
    const currentPage =
      scrollbarPercent < 100
        ? Math.floor(scrollbarPercent / 100 * totalPages) + 1
        : totalPages;

    return (
      <Fragment>
        {!reuse && <Header />}
        <Wrapper reuse={reuse} className="main hbox space-between">
          <Resizable
            defaultSize={{ width: 356 }}
            minWidth="356"
          >
            <Templates
              onSelect={node =>
                this.setState({ document: this.createFromNode(node) })
              }
              data={templates}
              opens={opens}
              showTemplate={this.showPreviewTemplate}
              onEdit={this.showEditDialog}
              onDelete={this.showDeleteDialog}
              onAddContent={this.showAddContentDialog}
              onAddFolder={this.showAddFolderDialog}
              openFolder={openFolder}
              moveTemplate={moveTemplate}
            />

            {kind === "folder" && (
              <FolderModal item={item} onClose={this.hideDialog} />
            )}
            {kind === "content" && (
              <ContentModal item={item} onClose={this.hideDialog} />
            )}
            {kind === "delete" && (
              <DeleteModal item={item} onClose={this.hideDialog} />
            )}
          </Resizable>

          {!reuse && (
            <div className="main left-section-border">
              <div
                className="template-preview preview-page"
                style={{
                  display: document ? "flex" : "none",
                  flex: "1 1 0%",
                  position: "relative",
                  overflowX: "hidden",
                  overflowY: "hidden",
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
                    pagesPerRow={2}
                    hideDisclaimer
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
          )}

          {!reuse && (
            <Link className="general-help-button" to="/support">
              ?
            </Link>
          )}
        </Wrapper>
      </Fragment>
    );
  }
}

export default connect(
  ({ template, document }) => ({
    templates: template.templates,
    opens: template.opens
  }),
  { getTemplates, openFolder, moveTemplate }
)(Library);
