import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deleteTemplate } from 'api/modules/template';
import Wrapper from './Wrapper';

class DeleteModal extends Component {
  onDelete = () => {
    const { item, deleteTemplate, onClose } = this.props;
    deleteTemplate({
      id: item.id
    });
    onClose();
  };

  render() {
    const { item, onClose } = this.props;

    return (
      <Wrapper className="wizard-container" onClick={onClose}>
        <div className="wizard">
          <div
            className="wizard-content"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <div className="wizard-text">
              Are you sure that you want to delete "{item.title}"? This action cannot be undone.
            </div>
            <button className="large form button" onClick={this.onDelete}>
              Delete
            </button>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default connect(null, { deleteTemplate })(DeleteModal);
