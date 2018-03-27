import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import _ from 'lodash';
import PreviewSidebarItem from './PreviewSidebarItem';

class PreviewSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      searchValue: '',
      namedSelections: {}
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.id !== this.props.id || nextProps.title !== this.props.title || nextProps.selections !== this.props.selections) {
      return true;
    }

    if (nextState.searchValue !== this.state.searchValue) {
      return true;
    }

    return false;
  }

  matchText(text) {
    return text.toLocaleLowerCase().indexOf(this.state.searchValue) > -1;
  }

  updateSearch = (e) => {
    this.setState({ searchValue: e.target.value.toLocaleLowerCase() });
  }

  makeIndex(level) {
    return level.join('.');
  }

  makeTitle(selection) {
    return `${selection.level.join('.')}. ${selection.title}`;
  }

  parseSelections(selections, searchValue) {
    const matches = selections.filter(selection => this.matchText(selection.title)).map(selection => selection.level);
    const indices = [];
    
    // need to expand the matches to include parents (a match for item '2.1' should also show parent '2')
    for (let match of matches) {
      for (let i = 1; i <= match.length; i++) {
        const index = this.makeIndex(match.slice(0, i));
        indices.push(index);
      }
    }

    const items = selections.filter(selection => indices.indexOf(this.makeIndex(selection.level)) > -1).map(selection => ({
      id: selection.id,
      title: this.makeTitle(selection),
      depth: selection.level.length
    }));

    return items.sort((a, b) => a.title > b.title ? 1 : -1);
  }

  onClickItem = (id) => {
    this.props.onClick(this.props.selections[id]);
  }

  render() {
    const { id, title } = this.props;
    const items = this.parseSelections(_.values(this.props.selections), this.state.searchValue);

    return (
      <div className="sidebar">
        <Link to={`/builder/${id}`} className="bottom-navigation-button">
          <h1 className="header1" style={{color: 'rgb(255, 255, 255)'}}>Back to Builder</h1>
        </Link>
        <div className="section-header-block">
          <h1 className="header1">{title}</h1>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', flex: '1 1 0%'}}>
          <div style={{flex: '1 1 0%', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
            {items.map(item => <PreviewSidebarItem { ...item } key={item.title} onClick={this.onClickItem} />)}
          </div>
          <div className="search-container">
            <i className="pro icon-search" style={{"marginRight":"10px","fontSize":"16px"}}></i>
            <input placeholder="Search Sections" className="inline-input" onChange={this.updateSearch} />
          </div>
        </div>
        <div className="splitter" id="document-preview-selection-tree-splitter" data-min-width="300" data-max-width="2147483647"
          style={{display: 'none'}}></div>
      </div>
    );
  }
}

PreviewSidebar.propTypes = {
  title: PropTypes.string,
  selections: PropTypes.object,
  onClick: PropTypes.func,
  id: PropTypes.string
};

export default PreviewSidebar;