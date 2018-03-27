import React from 'react';
import PropTypes from 'prop-types'

class DocumentDeleteModal extends React.Component {
  componentWillMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  handleOutsideClick = e => {
    if (this.node.contains(e.target)) {
      return;
    }
    this.props.onHide();
  }

  render() {
    return (
      <div className="wizard-container">
        <div className="wizard">
          <div className="wizard-content" ref={node => { this.node = node; }}>
            <div className="wizard-text">Are you sure that you want to delete "{this.props.title}"? This action cannot be undone.</div>
            <button className="large form button" style={{marginTop: 30}} onClick={this.props.onDelete}>Delete</button>
          </div>
        </div>
      </div>
    )
  }
}

DocumentDeleteModal.propsTypes = {
  title: PropTypes.string,
  onHide: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DocumentDeleteModal;