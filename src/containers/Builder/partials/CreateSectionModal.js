import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

const propTypes = {
  onSubmit: PropTypes.func,
  onHide: PropTypes.func,
};

const defaultProps = {};

class CreateSectionModal extends Component {
  state = {};
  componentDidMount() {
    this.titleNode.focus();
  }

  handleClickOutside = () => {
    this.props.onHide('hidden');
  };

  render() {
    const { onSubmit } = this.props;
    return (
      <div className="wizard-content">
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              name="section"
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
            Create Section
          </button>
        </form>
      </div>
    );
  }
}

CreateSectionModal.propTypes = propTypes;
CreateSectionModal.defaultProps = defaultProps;

CreateSectionModal = enhanceWithClickOutside(CreateSectionModal);

export default CreateSectionModal;
