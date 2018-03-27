import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import { Editor } from '@tinymce/tinymce-react';

const propTypes = {
  onHide: PropTypes.func,
  documentId: PropTypes.string,
  selectionId: PropTypes.string,
  textBlocks: PropTypes.array,
  title: PropTypes.string,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editTextblock: PropTypes.func,
};

const defaultProps = {};

class EditTextblock extends Component {
  state = { content: '' };

  _handleEditorChange = e => {
    this.setState({ content: e.target.getContent() });
  };

  _onSubmit = e => {
    e.preventDefault();
    const {
      documentId,
      selectionId,
      textBlocks,
      index,
      title,
      onHide,
      editTextblock,
    } = this.props;
    const { content } = this.state;
    const arrayCopy = [...textBlocks];
    arrayCopy[index] = content;

    const payload = {
      body: {
        documentId,
        selectionId,
        textBlocks: arrayCopy,
        title,
      },
    };

    Promise.resolve(editTextblock({ payload })).then(response => onHide());
  };

  _onHide = () => {
    this.props.onHide('hidden');
  };

  render() {
    const { index, textBlocks } = this.props;
    return (
      <div id="editor-x" className="wizard-content">
        <form onSubmit={this._onSubmit}>
          <div>
            <Editor
              initialValue={textBlocks[index]}
              init={{
                plugins: 'textcolor lists table',
                toolbar:
                  'bold italic underline forecolor numlist bullist table',
                menubar: false,
                statusbar: false,
                height: 300,
                setup: function(editor) {
                  editor.on('change', function(e) {
                    console.log(editor.getContent());
                  });
                },
                target: this,
              }}
              onChange={this._handleEditorChange}
            />
          </div>
          <button
            type="submit"
            className="large form button"
            style={{ marginTop: 20 }}
          >
            Update Content
          </button>
        </form>
      </div>
    );
  }
}

EditTextblock.propTypes = propTypes;
EditTextblock.defaultProps = defaultProps;

EditTextblock = enhanceWithClickOutside(EditTextblock);

export default EditTextblock;
