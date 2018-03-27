import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Wrapper from './Wrapper';

class AddContent extends Component {
  onAdd = () => {
    this.props.onClose();
  };

  render() {
    return (
      <Wrapper className="wizard-container">
        <div className="wizard page">
          <div className="wizard-title">
            <h1>Add content</h1>
          </div>
          <div className="wizard-content">
            <form onSubmit={this.onAdd}>
              <div>
                <input className="field" placeholder="Title" required />
              </div>
              <div style={{ marginTop: '15px' }}>
                <div>
                  <Editor
                    init={{
                      plugins: 'link image code table',
                      toolbar: 'bold italic | alignleft aligncenter alignright | table'
                    }}
                    // onChange={this.handleEditorChange}
                  />
                </div>
              </div>
              <div className="buttons">
                <button type="button" className="flat black bold button" onClick={this.props.onClose}>
                  Cancel
                </button>
                <button type="submit" className="flat blue bold button">
                  Add
                </button>
              </div>
              <div className="comment">
                Tip: Add variables into your content. using square brackets. Example: "Our project manager will be [pm
                name]." "We have served [client] for [years] years."
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default AddContent;
