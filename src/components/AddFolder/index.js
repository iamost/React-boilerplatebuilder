import React, { Component } from 'react';
import Wrapper from './Wrapper';

class AddFolder extends Component {
  onAdd = () => {
    this.props.onClose();
  };

  render() {
    return (
      <Wrapper className="wizard-container">
        <div className="wizard">
          <div className="wizard-title">
            <h1>Add folder</h1>
          </div>
          <div className="wizard-content">
            <form onSubmit={this.onAdd}>
              <div>
                <input className="field" placeholder="Title" required />
              </div>
              <div className="buttons">
                <button type="button" className="flat black bold button" onClick={this.props.onClose}>
                  Cancel
                </button>
                <button type="submit" className="flat blue bold button">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default AddFolder;
