import React, { Component } from 'react'
import './styles.scss'

class Billboard extends Component {
  render() {
    return (
      <div className="billboard-container">
        <img src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/banner.jpg" className="billboard-img" alt="" />
        <span className="billboard-title">Support</span>
      </div>
    )
  }
}

export default Billboard
