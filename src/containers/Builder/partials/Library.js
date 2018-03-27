import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FlexChildWrap } from './styles';

class Library extends Component {
  state = {};
  render() {
    return (
      <div style={{ width: 356 }} className="flex-d flex-col">
        <div className="section-header-box" />
        <FlexChildWrap>
          <div className="flex-d flex-whole flex-col overflow-y-s" />
          <div className="search-box" />
        </FlexChildWrap>
      </div>
    );
  }
}

export default Library;
