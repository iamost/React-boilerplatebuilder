import React from 'react'
import { NavLink } from 'react-router-dom';
import './styles.scss'

const createDocument = (props) => {
      return (
        <div className="boxWrp">
          <img
            src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/document.png"
            className="box-img"
            alt="create-document" />
          <button
            className="create-document"
            onClick={props.openDocumentModal}>
            Create Document
          </button>
          <div className="box-footer">
            <NavLink className="help" to="/support" >Need help?</NavLink>
          </div>
        </div>
      )
}

export default createDocument;
