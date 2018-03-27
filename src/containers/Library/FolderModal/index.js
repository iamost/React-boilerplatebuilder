import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFolder, updateFolder } from 'api/modules/template';
import Wrapper from './Wrapper';

class FolderModal extends Component {
  componentDidMount() {
    this.refTitle.focus();
  }

  onSave = () => {
    const { item, addFolder, updateFolder, onClose } = this.props;
    const title = this.refTitle.value;

    if (!item.id) {
      addFolder({
        body: {
          parentId: item.parentId,
          title
        }
      });
    } else {
      updateFolder({
        id: item.id,
        body: { title }
      });
    }
    onClose();
  };

  render() {
    const { item, onClose } = this.props;

    return (
      <Wrapper className="wizard-container">
        <div className="wizard">
          <div className="wizard-title">
            <h1>{item.id ? 'Edit' : 'Add'} folder</h1>
          </div>
          <div className="wizard-content">
            <form onSubmit={this.onSave}>
              <div>
                <input
                  className="field"
                  placeholder="Title"
                  required
                  defaultValue={item.title}
                  ref={ref => {
                    this.refTitle = ref;
                  }}
                />
              </div>
              <div className="buttons">
                <button type="button" className="flat black bold button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="flat blue bold button">
                  {item.id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default connect(null, { addFolder, updateFolder })(FolderModal);
