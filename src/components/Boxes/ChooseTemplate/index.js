import React from 'react'
import { NavLink } from 'react-router-dom';
import './styles.scss'

const chooseTemplate = (props) => {
      return (
        <div className="boxWrp">
          <img
            src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/template.png"
            className="box-img"
            alt="choose-template" />
          <div
            className="choose-template">
            <NavLink to="/documents">Choose Template</NavLink>
          </div>
          <div className="box-footer">
            <div className="coming-soon">This feature coming soon!</div>
            <NavLink className="help" to="/support">Need help?</NavLink>
          </div>
        </div>
      )
}

export default chooseTemplate;
