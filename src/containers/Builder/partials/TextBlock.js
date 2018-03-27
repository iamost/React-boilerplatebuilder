import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'lodash';

import * as actions from '../../../api/modules/document';
import { Modal } from '../../../components/common';
import EditTextblock from './EditTextblock';

const propTypes = {
  templateMarkup: PropTypes.string,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  match: PropTypes.object,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectionId: PropTypes.string,
  upTextblock: PropTypes.func,
  downTextblock: PropTypes.func,
  textBlocks: PropTypes.array,
  title: PropTypes.string,
  deleteTextblock: PropTypes.func,
  editTextblock: PropTypes.func,
};

const defaultProps = {};

class TextBlock extends Component {
  state = { editModal: 'hidden' };

  _onShowEditModal = () => {
    this.setState({ editModal: 'visible' });
  };

  _onHideEditModal = () => {
    this.setState({ editModal: 'hidden' });
  };

  render() {
    const {
      templateMarkup,
      isFirst,
      isLast,
      match,
      index,
      selectionId,
      upTextblock,
      downTextblock,
      deleteTextblock,
      editTextblock,
      textBlocks,
      title,
    } = this.props;
    const { params: { documentId } } = match;
    const modifiedTextblock = [...textBlocks];
    modifiedTextblock.splice(index, 1);
    const navigationPayload = {
      body: {
        documentId,
        selectionId,
        index,
      },
    };
    const deletingPayload = {
      body: {
        documentId,
        selectionId,
        textBlocks: modifiedTextblock,
        title,
      },
    };
    const { editModal } = this.state;
    return (
      <Fragment>
        <div className="section-content" style={{ marginBottom: 10 }}>
          <div
            className="right-section-border"
            style={{ flex: '1 1 0%', padding: '10px 15px' }}
          >
            <div
              id="selection-text-block-text-3"
              className="html-preview"
              style={{
                fontFamily: "'Times New Roman', serif",
                fontSize: 15,
                lineHeight: 1.25,
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: templateMarkup }} />
            </div>
          </div>
          <div className="block-icons">
            <span style={{ marginLeft: 'auto' }}>
              {!isFirst && (
                <span style={{ paddingRight: 10 }}>
                  <a
                    onClick={() => upTextblock({ payload: navigationPayload })}
                  >
                    <i className="action pro icon-arrow-up disabled" />
                  </a>
                </span>
              )}
              {!isLast && (
                <span style={{ paddingRight: 10 }}>
                  <a
                    onClick={() =>
                      downTextblock({ payload: navigationPayload })
                    }
                  >
                    <i className="action pro icon-arrow-down disabled" />
                  </a>
                </span>
              )}
              <span style={{ paddingRight: 10 }}>
                <a onClick={this._onShowEditModal}>
                  <i className="action pro icon-edit disabled" />
                </a>
              </span>
              <span style={{ paddingRight: 0 }}>
                <a
                  onClick={() => deleteTextblock({ payload: deletingPayload })}
                >
                  <i className="action pro icon-delete disabled" />
                </a>
              </span>
            </span>
          </div>
        </div>
        {editModal === 'visible' && (
          <Modal>
            <EditTextblock
              editTextblock={editTextblock}
              documentId={documentId}
              selectionId={selectionId}
              textBlocks={textBlocks}
              index={index}
              title={title}
              onHide={this._onHideEditModal}
            />
          </Modal>
        )}
      </Fragment>
    );
  }
}

TextBlock.propTypes = propTypes;
TextBlock.defaultProps = defaultProps;

TextBlock = connect(state => {
  const documentState = get(state, 'document');

  return { ...documentState };
}, actions)(TextBlock);
TextBlock = withRouter(TextBlock);

export default TextBlock;
