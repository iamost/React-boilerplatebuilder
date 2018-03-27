import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';

import { addContent, updateContent } from 'api/modules/template';
import Wrapper from './Wrapper';

class ContentModal extends Component {
  componentDidMount() {
    this.refTitle.focus();
    this.text = this.props.item.text;
  }

  onSave = () => {
    const { item, addContent, updateContent, onClose } = this.props;
    const title = this.refTitle.value;

    if (!item.id) {
      addContent({
        body: {
          parentTemplateId: item.parentId,
          title,
          text: this.text || ''
        }
      });
    } else {
      updateContent({
        body: {
          templateId: item.id,
          title,
          text: this.text || ''
        }
      });
    }
    onClose();
  };

  handleEditorChange = e => {
    this.text = e.target.getContent();
  };

  render() {
    const { item, onClose } = this.props;

    return (
      <Wrapper className="wizard-container">
        <div className="wizard page">
          <div className="wizard-title">
            <h1>{item.id ? 'Edit' : 'Add'} content</h1>
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
              <div style={{ marginTop: '15px' }}>
                <div>
                  <Editor
                    initialValue={item.text}
                    init={{
                      selector: 'textarea',
                      height: 250,
                      plugins: ['textcolor lists table'],
                      toolbar: 'bold italic underline forecolor bullist numlist table',
                      menubar: false,
                      statusbar: false,
                      toolbar_items_size: 'small'
                    }}
                    onChange={this.handleEditorChange}
                  />
                </div>
              </div>
              <div className="buttons">
                <button type="button" className="flat black bold button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="flat blue bold button">
                  {item.id ? 'Update' : 'Add'}
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

export default connect(null, { addContent, updateContent })(ContentModal);
