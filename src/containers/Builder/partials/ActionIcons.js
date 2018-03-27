import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  selection: PropTypes.object,
  showArrowLeft: PropTypes.bool,
  showArrowDown: PropTypes.bool,
  showArrowRight: PropTypes.bool,
  showArrowUp: PropTypes.bool,
  onModifySelection: PropTypes.func,
  showUpdateSectionModal: PropTypes.func,
  expanded: PropTypes.bool
};

const defaultProps = {};

let ActionIcons = ({
  showArrowLeft,
  showArrowDown,
  showArrowRight,
  showArrowUp,
  onModifySelection,
  showUpdateSectionModal,
  selection,
  expanded
}) => {
  const iconClass = expanded ? '' : 'disabled';
  return (
    <span className="func-icons">
      {showArrowLeft && (
        <span className="pad_10">
          <a
            className="pointer-s"
            onClick={e => {
              onModifySelection(selection.id, 'left', e);
            }}
          >
            <i
              name="test"
              className={`action pro icon-arrow-left ${iconClass}`}
            />
          </a>
        </span>
      )}
      {showArrowRight && (
        <span className="pad_10">
          <a
            className="pointer-s"
            onClick={e => {
              onModifySelection(selection.id, 'right', e);
            }}
          >
            <i
              name="test"
              className={`action pro icon-arrow-right ${iconClass}`}
            />
          </a>
        </span>
      )}
      {showArrowUp && (
        <span className="pad_10">
          <a
            className="pointer-s"
            onClick={e => {
              onModifySelection(selection.id, 'up', e);
            }}
          >
            <i
              name="test"
              className={`action pro icon-arrow-up ${iconClass}`}
            />
          </a>
        </span>
      )}
      {showArrowDown && (
        <span className="pad_10">
          <a
            className="pointer-s"
            onClick={e => {
              onModifySelection(selection.id, 'down', e);
            }}
          >
            <i
              name="test"
              className={`action pro icon-arrow-down ${iconClass}`}
            />
          </a>
        </span>
      )}
      <span className="pad_10">
        <a
          className="pointer-s"
          onClick={e => {
            showUpdateSectionModal(
              selection.id,
              selection.title,
              selection.textBlocks,
              'visible',
              e
            );
          }}
        >
          <i name="test" className={`action pro icon-edit ${iconClass}`} />
        </a>
      </span>
      <span className="">
        <a
          className="pointer-s"
          onClick={e => {
            onModifySelection(selection.id, 'delete', e);
          }}
        >
          <i name="test" className={`action pro icon-delete ${iconClass}`} />
        </a>
      </span>
    </span>
  );
};

ActionIcons.propTypes = propTypes;
ActionIcons.defaultProps = defaultProps;

export default ActionIcons;
