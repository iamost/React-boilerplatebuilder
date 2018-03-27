import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, flattenDeep, uniq } from 'lodash';

import { FlexChildWrap } from './styles';
import UpdateSectionModal from './UpdateSectionModal';
import CreateSectionModal from './CreateSectionModal';
import { Modal } from 'components/common';
import Selection from './Selection';

const propTypes = {
  currentDocument: PropTypes.object,
  upUpdateDocument: PropTypes.func,
  downUpdateDocument: PropTypes.func,
  rightUpdateDocument: PropTypes.func,
  leftUpdateDocument: PropTypes.func,
  updateSelection: PropTypes.func,
  createSelection: PropTypes.func,
  documentId: PropTypes.string,
  getDocument: PropTypes.func,
};

const defaultProps = {};

class BuilderMain extends Component {
  state = {
    updateSectionModal: 'hidden',
    createSectionModal: 'hidden',
    selectionTitle: '',
    selectionId: '',
    textBlocks: [],
    value: '',
    resultArray: [],
    currentExpanded: '',
  };

  _onSetExpandedSelection = selectionId => {
    this.setState({ currentExpanded: selectionId });
    this.props.setCurrentSelection(selectionId);
  };

  showUpdateSectionModal = (
    selectionId,
    selectionTitle,
    textBlocks,
    modalStatus,
    e
  ) => {
    this.setState({
      updateSectionModal: modalStatus,
      selectionId,
      selectionTitle,
      textBlocks,
    });
    e.preventDefault();
    e.stopPropagation();
  };

  hideUpdateSectionModal = modalStatus => {
    this.setState({
      updateSectionModal: modalStatus,
      selectionId: '',
      selectionTitle: '',
      textBlocks: [],
    });
  };

  showCreateSectionModal = e => {
    this.setState({ createSectionModal: 'visible' });
    e.preventDefault();
    e.stopPropagation();
  };

  hideCreateSectionModal = () => {
    this.setState({ createSectionModal: 'hidden' });
  };

  innerChildrenSort = (array1, array2) => {
    const arrLen1 = array1.length;
    const arrLen2 = array2.length;
    const isSameLength = arrLen1 === arrLen2;
    let lengthToUse = 0;
    let counter = 1;

    lengthToUse = arrLen1 < arrLen2 ? arrLen1 : arrLen2;
    if (isSameLength) lengthToUse = arrLen1;

    while (counter < lengthToUse) {
      if (array1[counter] < array2[counter]) return -1;

      if (array1[counter] > array2[counter]) return 1;

      if (
        counter === lengthToUse - 1 &&
        array1[counter] === array2[counter] &&
        !isSameLength
      ) {
        return arrLen1 < arrLen2 ? -1 : 1;
      }

      counter++;
    }
  };

  sortKeys = ({ selectionKeys, selections }) => {
    const copyOfKeys = [...selectionKeys];
    copyOfKeys.sort((firstKey, secondKey) => {
      let k1 = selections[firstKey].level;
      let k2 = selections[secondKey].level;
      if (k1[0] < k2[0]) {
        return -1;
      }

      if (k1[0] > k2[0]) {
        return 1;
      }

      if (k1.length === 1) {
        return -1;
      }

      if (k2.length === 1) {
        return 1;
      }

      return this.innerChildrenSort(k1, k2);
    });

    return copyOfKeys;
  };

  getAncestors = () => {
    const result = [];

    return function traverse(key, selections) {
      if (selections[key].parent) {
        result.push(selections[key].parent);

        return traverse(selections[key].parent, selections);
      }

      return result;
    };
  };

  convertToString = arrayOfString => {
    if (!isEmpty(arrayOfString)) {
      const minimizedStr = arrayOfString
        .map(str => {
          const cleanedStr = str.replace(/<{1}[^<>]{1,}>{1}/g, ' ');
          return cleanedStr;
        })
        .reduce((prev, curr) => `${prev} ${curr}`);

      return minimizedStr;
    }

    return '';
  };

  filterBySearch = selections => {
    const { value } = this.state;
    const allKeys = !isEmpty(selections) ? Object.keys(selections) : [];

    if (value) {
      const allUniqueHits = allKeys.filter(
        key =>
          `${selections[key].title} ${this.convertToString(
            selections[key].textBlocks
          )}`
            .toLowerCase()
            .indexOf(value.toLowerCase()) >= 0
      );

      const withDuplicate = allUniqueHits.map(hitKey => {
        return this.getAncestors()(hitKey, selections);
      });

      const allWithDuplicate = [
        ...flattenDeep(withDuplicate),
        ...allUniqueHits,
      ];

      return uniq(allWithDuplicate);
    }

    return allKeys;
  };

  getSelectionsInOrder = ({ selections }) => {
    const selectionKeys = this.filterBySearch(selections);
    const sortedKeys = this.sortKeys({ selectionKeys, selections });
    const sortedSelection = [];
    sortedKeys.forEach(key => {
      sortedSelection.push(selections[key]);
    });

    return sortedSelection;
  };

  _onSubmitChanges = e => {
    e.preventDefault();
    const { selectionId, textBlocks } = this.state;
    const { documentId, updateSelection } = this.props;
    const title = e.target['section'].value;
    this.hideUpdateSectionModal('hidden');
    const payload = {
      body: {
        documentId,
        selectionId,
        textBlocks,
        title,
      },
    };
    updateSelection({ payload });
  };

  _onSubmitNewSection = e => {
    e.preventDefault();
    const { documentId, createSelection } = this.props;
    const title = e.target['section'].value;
    this.hideCreateSectionModal('hidden');
    const payload = {
      body: {
        document: documentId,
        title,
      },
    };
    createSelection({ payload });
  };

  _onModifySelection = (selectionId, operation, e) => {
    const {
      upUpdateDocument,
      downUpdateDocument,
      rightUpdateDocument,
      leftUpdateDocument,
      deleteSelection,
      documentId,
    } = this.props;
    switch (operation) {
      case 'up':
        upUpdateDocument({ documentId, selectionId });
        break;
      case 'down':
        downUpdateDocument({ documentId, selectionId });
        break;
      case 'right':
        rightUpdateDocument({ documentId, selectionId });
        break;
      case 'left':
        leftUpdateDocument({ documentId, selectionId });
        break;
      case 'delete':
        deleteSelection({ documentId, selectionId });
        break;
      default:
        break;
    }
    e.preventDefault();
    e.stopPropagation();
  };

  _onChangeSearchTerm = ({ target }) => {
    const { value } = target;
    this.setState({ value });
  };

  renderJSON() {
    const { currentDocument: { selections } } = this.props;
    const selectionsInOrder = this.getSelectionsInOrder({ selections });
    return (
      <div>
        <pre>
          <samp>{JSON.stringify(selectionsInOrder, null, 4)}</samp>
        </pre>
      </div>
    );
  }

  render() {
    const {
      currentDocument: { title, selections },
      documentId,
      editTextblock,
      substituteVariables,
    } = this.props;
    const selectionsInOrder = this.getSelectionsInOrder({ selections });
    const {
      updateSectionModal,
      selectionTitle,
      createSectionModal,
      value,
      currentExpanded,
    } = this.state;

    return (
      <FlexChildWrap className="left-section-border">
        <div className="section-header-box">
          <div className="section-header-title section-header-wide">
            Builder
          </div>
          <a onClick={this.showCreateSectionModal} className="pointer-s">
            <i className="material-icons pointer-s">add</i>
          </a>
        </div>
        <div className="section-header-box white-bg">
          <div className="section-header-title section-header-wide">
            {title}
          </div>
        </div>
        {value && selectionsInOrder.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flex: '1 1 0%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: 'rgb(175, 175, 175)',
              }}
            >
              No sections match the search criteria.
            </div>
          </div>
        ) : (
          <FlexChildWrap>
            <div className="flex-main">
              <div>
                {selectionsInOrder.map((selection, index, selectionArray) => {
                  const strLevel = selection.level.join('.');
                  const selectLen = selection.level.length;

                  const showArrowDown =
                    (!!selection.parent &&
                      !!selections[selection.parent].next) ||
                    !!selection.next;

                  const showArrowUp =
                    !!selection.parent || !!selection.previous;

                  const showArrowLeft = selectLen >= 2;

                  const showArrowRight =
                    !!selection.previous &&
                    selection.level.length <=
                      selections[selection.previous].level.length;

                  return (
                    <Selection
                      key={selection.id}
                      selectLen={selectLen}
                      selection={selection}
                      strLevel={strLevel}
                      showArrowLeft={!!showArrowLeft}
                      showArrowRight={!!showArrowRight}
                      showArrowDown={!!showArrowDown}
                      showArrowUp={!!showArrowUp}
                      onModifySelection={this._onModifySelection}
                      showUpdateSectionModal={this.showUpdateSectionModal}
                      onExpand={this._onSetExpandedSelection}
                      currentExpanded={currentExpanded}
                      isFirst={index === 0}
                      isLast={index === selectionArray.length - 1}
                      documentId={documentId}
                      editTextblock={editTextblock}
                      substituteVariables={substituteVariables}
                    />
                  );
                })}
              </div>
            </div>
          </FlexChildWrap>
        )}
        <div className="search-box">
          <i className="pro icon-search" />
          <input
            placeholder="Search Sections"
            type="text"
            className="inline-input"
            value={value}
            onChange={this._onChangeSearchTerm}
          />
        </div>
        {updateSectionModal === 'visible' && (
          <Modal>
            <UpdateSectionModal
              onSubmit={this._onSubmitChanges}
              onHide={this.hideUpdateSectionModal}
              selectionTitle={selectionTitle}
            />
          </Modal>
        )}
        {createSectionModal === 'visible' && (
          <Modal>
            <CreateSectionModal
              onSubmit={this._onSubmitNewSection}
              onHide={this.hideCreateSectionModal}
            />
          </Modal>
        )}
      </FlexChildWrap>
    );
  }
}

BuilderMain.propTypes = propTypes;
BuilderMain.defaultProps = defaultProps;

export default BuilderMain;
