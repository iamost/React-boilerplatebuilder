import React, { Component, Fragment } from "react";

import Wrapper from "./Wrapper";

class Templates extends Component {
  state = {};

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const { data } = nextProps;
      this.setState({ tempaltes: getChildren(null) });
      this.onFilter(null, data);

      function getChildren(parentId) {
        const nodes = [];
        const items = data.filter(item => item.parentId === parentId);
        let node = items.filter(item => item.prevId === null)[0];
        while (node) {
          nodes.push(node);
          const children = getChildren(node.id);
          if (children.length) {
            node.children = children;
          }
          node = getNextNode(node);
        }

        function getNextNode(node) {
          return data.filter(({ id }) => id === node.nextId)[0];
        }
        return nodes;
      }
    }
  }

  onFilter = (e, data) => {
    const str = e && e.target.value;
    let visibleNodeIds;
    if (str) {
      visibleNodeIds = {};
      data = data || this.props.data;
      data.forEach(item => {
        const { id, title, text } = item;
        if (!visibleNodeIds[id]) {
          if (title.indexOf(str) !== -1 || (text || "").indexOf(str) !== -1) {
            visibleNodeIds[id] = 1;
            while (item.parentId) {
              item = this.getParentNode(item, data);
              visibleNodeIds[item.id] = 2;
            }
          }
        }
      });
    }
    this.setState({ visibleNodeIds });
  };

  onDragStart = (dragSource, e) => {
    e.dataTransfer.setData("text/html", dragSource.text);
    this.setState({ dragSource });
  };

  onDragEnd = e => {
    e.preventDefault();
    const { selectedDropMenu, dragSource, dropTagetInfo } = this.state;
    if (selectedDropMenu) {
      this.props.moveTemplate({
        where: selectedDropMenu,
        from: dragSource.id,
        to: dropTagetInfo.id
      });
    }
    this.setState({
      dragSource: null,
      dropTagetInfo: null,
      selectedDropMenu: null
    });
  };

  onShowDropMenu = dropTaget => {
    this.onContentSelect(null);
    let item = dropTaget;
    while (item) {
      if (item.id === this.state.dragSource.id) return;
      item = this.getParentNode(item, this.props.data);
    }

    const { dragSource } = this.state;
    this.setState({
      dropTagetInfo: {
        id: dropTaget.id,
        before: dropTaget.prevId !== dragSource.id,
        into: dropTaget.folder && dropTaget.id !== dragSource.parentId
      }
    });
  };

  getParentNode = (node, data) => {
    return data.filter(({ id }) => id === node.parentId)[0];
  };

  onContentSelect(node, e) {
    this.setState({ selectedItem: node });
    if (this.props.onSelect)
      this.props.onSelect(node && node.folder ? null : node);
  }

  renderNode = item => {
    const {
      opens,
      onEdit,
      onDelete,
      onAddContent,
      onAddFolder,
      openFolder
    } = this.props;
    const {
      dropTagetInfo,
      visibleNodeIds,
      selectedDropMenu,
      selectedItem
    } = this.state;
    const { id, title, folder } = item;
    let children = item.children;
    let open = opens[id];
    let isSelected = selectedItem && selectedItem.id === id;

    const itemStyle =
      !isSelected || folder
        ? {}
        : {
            padding: "1px 0px 1px",
            backgroundColor: "rgba(55, 109, 114, 0.1)"
          };

    if (visibleNodeIds) {
      if (!visibleNodeIds[id]) return null;
      if (visibleNodeIds[id] === 1) {
        children = null;
      } else {
        open = true;
      }
    }

    return (
      <li key={id}>
        {(dropTagetInfo || {}).id === id && (
          <div>
            {dropTagetInfo.before && (
              <span
                className={`drop-here-area ${
                  selectedDropMenu === "before" ? "selected" : ""
                }`}
                onDragEnter={() =>
                  this.setState({ selectedDropMenu: "before" })
                }
                onDragLeave={() => this.setState({ selectedDropMenu: null })}
                onDragOver={e => {
                  e.preventDefault();
                }}
              >
                Drop here to move before {title}
              </span>
            )}
            {dropTagetInfo.into && (
              <span
                className={`drop-here-area ${
                  selectedDropMenu === "into" ? "selected" : ""
                }`}
                onDragEnter={() => this.setState({ selectedDropMenu: "into" })}
                onDragLeave={() => this.setState({ selectedDropMenu: null })}
                onDragOver={e => e.preventDefault()}
              >
                Drop here to move into {title}
              </span>
            )}
          </div>
        )}

        <div
          className="actionable tree-element"
          style={itemStyle}
          onDragEnter={() => this.onShowDropMenu(item)}
        >
          <span className="arrow">
            {children && (
              <div onClick={() => openFolder({ id, open: !open })}>
                <i
                  className={`pro icon-library-${
                    open ? "expanded" : "collapsed"
                  }`}
                />
              </div>
            )}
          </span>

          <div
            className="content"
            draggable
            onDragStart={e => this.onDragStart(item, e)}
            onDragEnd={e => this.onDragEnd(e)}
            onClick={e => this.onContentSelect(item, e)}
          >
            <div>
              <i className={`pro ${folder ? "icon-folder" : "icon-document"}`}>
                <span className="path1" />
                <span className="path2" />
                {!folder && (
                  <Fragment>
                    <span className="path3" />
                    <span className="path4" />
                  </Fragment>
                )}
              </i>
            </div>
            <span className="tree-text">{title}</span>
          </div>

          <span className="actions">
            <span>
              <a
                title={`Edit ${folder ? "folder" : "content"}`}
                onClick={() => onEdit(item)}
              >
                <i className="material-icons">edit</i>
              </a>
            </span>
            <span>
              <a
                title={`Delete ${folder ? "folder" : "content"}`}
                onClick={() => onDelete(item)}
              >
                <i className="material-icons">close</i>
              </a>
            </span>
            {folder && (
              <Fragment>
                <span>
                  <a title="Add content" onClick={() => onAddContent(id)}>
                    <i className="material-icons">add</i>
                  </a>
                </span>
                <span>
                  <a title="Add folder" onClick={() => onAddFolder(id)}>
                    <i className="material-icons">create_new_folder</i>
                  </a>
                </span>
              </Fragment>
            )}
          </span>
        </div>

        {children &&
          open && <ul>{children.map(node => this.renderNode(node))}</ul>}
      </li>
    );
  };

  render() {
    const { onAddContent, onAddFolder } = this.props;
    const { tempaltes } = this.state;

    if (!tempaltes) return null;

    return (
      <Wrapper className="library-overview">
        <div className="section-header-block">
          <h1 className="header1">Library</h1>
          <i
            className="material-icons"
            title="Add content"
            onClick={() => onAddContent()}
          >
            add
          </i>
          <i
            className="material-icons"
            title="Add folder"
            onClick={() => onAddFolder()}
          >
            create_new_folder
          </i>
        </div>

        <div className="tree-container">
          <div className="top-level-tree">
            {tempaltes.length === 0 ? (
              <div className="empty">
                Start by adding your first content block or folder.
              </div>
            ) : (
              <ul>{tempaltes.map(node => this.renderNode(node))}</ul>
            )}
          </div>
        </div>
        <div className="search-container">
          <i className="pro icon-search" />
          <input
            className="inline-input"
            placeholder="Search Content Blocks"
            onChange={this.onFilter}
          />
        </div>
      </Wrapper>
    );
  }
}

export default Templates;
