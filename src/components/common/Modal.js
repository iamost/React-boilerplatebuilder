import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = { children: PropTypes.node };

const defaultProps = {};

class Modal extends Component {
  render() {
    return (
      <div className="wizard-container">
        <div className="wizard">{this.props.children}</div>
      </div>
    );
  }
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
