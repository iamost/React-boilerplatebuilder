import React, { Component } from 'react'

class FAQItem extends Component {
  constructor() {
    super()
    this.state = {
      displayed: false,
    }
  }
  toggleDisplayed = () => {
    this.setState({
      displayed: !this.state.displayed,
    })
  }
  render() {
    let hiddenClass = 'faq-content-container-hidden'
    if (this.state.displayed) hiddenClass = ''
    return (
      <div className="faq-item-container">
        <div className="faq-item-container-inner">
          <button className="faq-item-button" onClick={this.toggleDisplayed}>
            <span className="faq-item-title">{this.props.title}</span>
            <i className="faq-chevron-icon" />
          </button>
          <div className={'faq-content-container ' + hiddenClass}>
            <div className="faq-content-container-inner">
              <div className="faq-content-title">Answer:</div>
              <div className="faq-content-text">{this.props.text}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FAQItem
