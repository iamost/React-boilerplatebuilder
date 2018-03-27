import React from 'react'
import { NavLink } from 'react-router-dom';
import './styles.scss'

const editLibrary = (props) => {
      return (
        <div className="boxWrp">
          <img
            src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/library.png"
            className="box-img"
            alt="edit-library" />
          <div className="edit-library">
            <NavLink to="/library">
              Edit Library
            </NavLink>
          </div>
          <div className="box-footer">
            <NavLink className="help" to="/support">Need help?</NavLink>
          </div>
        </div>
      )
}

export default editLibrary;
