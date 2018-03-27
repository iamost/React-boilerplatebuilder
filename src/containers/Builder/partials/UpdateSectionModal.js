import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

const propTypes = {
  onSubmit: PropTypes.func,
  onHide: PropTypes.func,
  selectionTitle: PropTypes.string
};

const defaultProps = {};

class UpdateSectionModal extends Component {
  state = {};
  componentDidMount() {
    this.titleNode.focus();
  }

  handleClickOutside = () => {
    this.props.onHide('hidden');
  };

  render() {
    const { onSubmit, selectionTitle } = this.props;
    return (
      <div className="wizard-content">
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              name="section"
              defaultValue={selectionTitle}
              className="field"
              placeholder="Title"
              ref={node => {
                this.titleNode = node;
              }}
            />
          </div>
          <button
            type="submit"
            className="large form button"
            style={{ marginTop: 20 }}
          >
            Update Section
          </button>
        </form>
      </div>
    );
  }
}

UpdateSectionModal.propTypes = propTypes;
UpdateSectionModal.defaultProps = defaultProps;

UpdateSectionModal = enhanceWithClickOutside(UpdateSectionModal);

export default UpdateSectionModal;
