import React, {Component} from 'react'
import PropTypes from 'prop-types'

class PreviewSidebarItem extends Component {
  clickHandler = () => {
    this.props.onClick(this.props.id);
  }

  render() {
    const { title, depth } = this.props;
    const depthClass = `sidebar-item-level-${depth}`;

    return (
      <div className="sidebar-item bottom-section-border" onClick={this.clickHandler}>
        <div className={depthClass}>
          <div className="actionable" style={{paddingRight: '16px', display: 'flex', alignItems: 'center'}}>
            <div className="tree-text" style={{display: 'inline-block', color: 'rgb(129, 129, 129)', paddingLeft: '8px'}}>{title}</div>
          </div>
        </div>
      </div>
    );
  }
}

PreviewSidebarItem.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  depth: PropTypes.number,
  onClick: PropTypes.func
};

export default PreviewSidebarItem;