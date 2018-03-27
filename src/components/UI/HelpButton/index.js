import React from 'react'
import { NavLink } from 'react-router-dom'
import './styles.scss'

const helpButton = (props) => (
        <div className="helpButton">
          <NavLink to={props.link}>?</NavLink>
        </div>
      );

export default helpButton;
