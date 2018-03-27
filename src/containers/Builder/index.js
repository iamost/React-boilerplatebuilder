import React, { Component } from 'react';
import Header from 'components/Header';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';

import { Wrapper } from './styles';
import Library from '../Library';
import BuilderMain from './partials/BuilderMain';
import Preview from './partials/Preview';
import * as actions from '../../api/modules/document';

const propTypes = {
  match: PropTypes.object,
  getDocument: PropTypes.func,
  upUpdateDocument: PropTypes.func,
  downUpdateDocument: PropTypes.func,
  rightUpdateDocument: PropTypes.func,
  leftUpdateDocument: PropTypes.func,
  createSelection: PropTypes.func,
  updateSelection: PropTypes.func,
  deleteSelection: PropTypes.func,
};

const defaultProps = {};

class Builder extends Component {
  componentDidMount() {
    const { match, getDocument, documentId } = this.props;
    getDocument({ documentId: match.params.documentId || documentId });
  }

  componentWillMount() {
    const { match, documentId } = this.props;
    if (!isEmpty(match.params && !documentId)) {
      this.props.history.push('/documents');
    }
  }

  componentWillUnmount() {
    this.props.setCurrentSelection('');
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.status !== this.props.status &&
      this.props.status !== 'GET_DOCUMENT/success'
    ) {
      const { match, getDocument } = this.props;
      getDocument({ documentId: match.params.documentId });
    }
  }

  substituteVariables = textBlock => {
    const newTextBlock = textBlock.replace(
      new RegExp(`(\\[([a-z0-9 _-]+)\\])`, 'gi'),
      '<span style="background-color: #ecd58c;" data-variable="$2" class="variable">$1</span>'
    );

    return newTextBlock;
  };

  render() {
    const {
      currentDocument,
      setCurrentSelection,
      currentSelection,
      match,
      upUpdateDocument,
      downUpdateDocument,
      rightUpdateDocument,
      leftUpdateDocument,
      createSelection,
      updateSelection,
      deleteSelection,
      getDocument,
      editTextblock,
    } = this.props;
    const documentId = match.params.documentId;
    const previewSelection = get(
      currentDocument,
      ['selections', currentSelection],
      {}
    );

    return (
      <div className="viewport vbox">
        <Header showBuilder />
        <Wrapper>
          <Library reuse />
          <BuilderMain
            currentDocument={currentDocument}
            documentId={documentId}
            upUpdateDocument={upUpdateDocument}
            downUpdateDocument={downUpdateDocument}
            rightUpdateDocument={rightUpdateDocument}
            leftUpdateDocument={leftUpdateDocument}
            createSelection={createSelection}
            updateSelection={updateSelection}
            deleteSelection={deleteSelection}
            getDocument={getDocument}
            setCurrentSelection={setCurrentSelection}
            editTextblock={editTextblock}
            substituteVariables={this.substituteVariables}
          />
          <Preview
            selection={previewSelection}
            documentId={documentId}
            substituteVariables={this.substituteVariables}
          />
          <Link className="general-help-button" to="/support">
            ?
          </Link>
        </Wrapper>
      </div>
    );
  }
}

Builder.propTypes = propTypes;
Builder.defaultProps = defaultProps;

Builder = connect(state => {
  const documentState = get(state, 'document');

  return { ...documentState };
}, actions)(Builder);

Builder = withRouter(Builder);

export default Builder;
