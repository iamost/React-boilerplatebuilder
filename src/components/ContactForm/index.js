import React, { Component } from 'react'
import axios from 'axios'
import './styles.scss'

class ContactForm extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      accountNumber: '',
      company: '',
      city: '',
      stateOrProvince: '',
      country: '',
      technicalIssue: 'login-difficulties',
      message: '',
    }
  }

  //this allows a single function to handle all input state updates
  //uses ES6 computed property names to dynamically set the object key
  handleInput = (event, stateValToChange) => {
    this.setState({
      [stateValToChange]: event.target.value,
    })
  }

  handleFormSubmit = e => {
    e.preventDefault()
    axios
      .post('/support/contact', this.state)
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      })
  }
  render() {
    return (
      <div className="content-container-1">
        <div className="content-container-2">
          <h1 className="content-header">Contact</h1>
          <form id="support-contact-form" onSubmit={this.handleFormSubmit}>
            <div className="contact-form-header">
              <div className="contact-form-header-title">Contact Support</div>
              <div className="contact-form-header-subtitle">Technical Support</div>
            </div>
            <div className="contact-form-container">
              <div className="contact-form-item-container">
                <div className="contact-form-label">
                  <div>First Name *</div>
                  <div>
                    <input
                      val={this.state.firstName}
                      onChange={e => {
                        this.handleInput(e, 'firstName')
                      }}
                      type="text"
                      name="firstname"
                      tabIndex="1"
                      className="contact-form-input"
                      required=""
                    />
                  </div>
                </div>
                <div className="contact-form-label">
                  <div>Phone Number *</div>
                  <div>
                    <input
                      val={this.state.phoneNumber}
                      onChange={e => {
                        this.handleInput(e, 'phoneNumber')
                      }}
                      type="tel"
                      name="usrtel"
                      tabIndex="4"
                      className="contact-form-input"
                      required=""
                    />
                  </div>
                </div>
                <div className="contact-form-label">
                  <div>City</div>
                  <div>
                    <input
                      val={this.state.city}
                      onChange={e => {
                        this.handleInput(e, 'city')
                      }}
                      type="text"
                      name="city"
                      tabIndex="7"
                      className="contact-form-input"
                    />
                  </div>
                </div>
              </div>
              <div className="contact-form-item-container">
                <div className="contact-form-label">
                  <div>Last Name *</div>
                  <div>
                    <input
                      val={this.state.lastName}
                      onChange={e => {
                        this.handleInput(e, 'lastName')
                      }}
                      type="text"
                      name="lastname"
                      tabIndex="2"
                      className="contact-form-input"
                      required=""
                    />
                  </div>
                </div>
                <div className="contact-form-label">
                  <div>Account Number *</div>
                  <div>
                    <input
                      val={this.state.accountNumber}
                      onChange={e => {
                        this.handleInput(e, 'accountNumber')
                      }}
                      type="text"
                      name="accnumber"
                      tabIndex="5"
                      className="contact-form-input"
                      required=""
                    />
                  </div>
                </div>
                <div className="contact-form-label">
                  <div>State/Province</div>
                  <div>
                    <input
                      val={this.state.stateOrProvince}
                      onChange={e => {
                        this.handleInput(e, 'stateOrProvince')
                      }}
                      type="text"
                      name="state"
                      tabIndex="8"
                      className="contact-form-input"
                    />
                  </div>
                </div>
              </div>
              <div className="contact-form-item-container">
                <div className="contact-form-label">
                  <div>Email Adress *</div>
                  <div>
                    <input
                      val={this.state.email}
                      onChange={e => {
                        this.handleInput(e, 'email')
                      }}
                      type="email"
                      name="email"
                      tabIndex="3"
                      className="contact-form-input"
                      required=""
                    />
                  </div>
                </div>
                <div className="contact-form-label">
                  <div>Company</div>
                  <div>
                    <input
                      val={this.state.company}
                      onChange={e => {
                        this.handleInput(e, 'company')
                      }}
                      type="text"
                      name="company"
                      tabIndex="6"
                      className="contact-form-input"
                    />
                  </div>
                </div>
                <div className="contact-form-label">
                  <div>Country</div>
                  <div>
                    <input
                      val={this.state.country}
                      onChange={e => {
                        this.handleInput(e, 'country')
                      }}
                      type="text"
                      name="country"
                      tabIndex="9"
                      className="contact-form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form-subsection">
              <div className="cfhead1">Technical issue</div>
              <div className="cfhead2">Message</div>
            </div>
            <div className="contact-form-subsection">
              <div className="contact-form-subsection-body contact-form-subsection-radio-body">
                <div className="contact-form-radio-col">
                  <div>
                    <input
                      type="radio"
                      name="issue"
                      tabIndex="10"
                      id="support-technical-issue-input-login-difficulties"
                      value="login-difficulties"
                      checked={this.state.technicalIssue === 'login-difficulties'}
                      onChange={e => {
                        this.handleInput(e, 'technicalIssue')
                      }}
                      className="contact-form-radio-input"
                    />
                    <label htmlFor="support-technical-issue-input-login-difficulties" className="contact-form-radio-input-label">
                      Login difficulties
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="issue"
                      tabIndex="-1"
                      id="support-technical-issue-input-document-creation"
                      value="document-creation"
                      checked={this.state.technicalIssue === 'document-creation'}
                      onChange={e => {
                        this.handleInput(e, 'technicalIssue')
                      }}
                      className="contact-form-radio-input"
                    />
                    <label htmlFor="support-technical-issue-input-document-creation" className="contact-form-radio-input-label">
                      Document creation
                    </label>
                  </div>
                </div>
                <div className="contact-form-radio-col">
                  <div>
                    <input
                      type="radio"
                      name="issue"
                      tabIndex="-1"
                      id="support-technical-issue-input-library-creation"
                      value="library-creation"
                      checked={this.state.technicalIssue === 'library-creation'}
                      onChange={e => {
                        this.handleInput(e, 'technicalIssue')
                      }}
                      className="contact-form-radio-input"
                    />
                    <label htmlFor="support-technical-issue-input-library-creation" className="contact-form-radio-input-label">
                      Library creation
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="issue"
                      tabIndex="-1"
                      id="support-technical-issue-input-document-preview"
                      value="document-preview"
                      checked={this.state.technicalIssue === 'document-preview'}
                      onChange={e => {
                        this.handleInput(e, 'technicalIssue')
                      }}
                      className="contact-form-radio-input"
                    />
                    <label htmlFor="support-technical-issue-input-document-preview" className="contact-form-radio-input-label">
                      Document preview
                    </label>
                  </div>
                </div>
                <div className="contact-form-radio-col">
                  <div>
                    <input
                      type="radio"
                      name="issue"
                      tabIndex="-1"
                      id="support-technical-issue-input-content-variables"
                      value="content-variables"
                      checked={this.state.technicalIssue === 'content-variables'}
                      onChange={e => {
                        this.handleInput(e, 'technicalIssue')
                      }}
                      className="contact-form-radio-input"
                    />
                    <label htmlFor="support-technical-issue-input-content-variables" className="contact-form-radio-input-label">
                      Content variables
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="issue"
                      tabIndex="-1"
                      id="support-technical-issue-input-document-export"
                      value="document-export"
                      checked={this.state.technicalIssue === 'document-export'}
                      onChange={e => {
                        this.handleInput(e, 'technicalIssue')
                      }}
                      className="contact-form-radio-input"
                    />
                    <label htmlFor="support-technical-issue-input-document-export" className="contact-form-radio-input-label">
                      Document export
                    </label>
                  </div>
                </div>
              </div>
              <div className="contact-form-subsection-body">
                <div>
                  <textarea
                    val={this.state.message}
                    onChange={e => {
                      this.handleInput(e, 'message')
                    }}
                    className="contact-form-textarea"
                    name="textarea"
                    rows="3"
                    cols="50"
                    tabIndex="11"
                  />
                </div>
                <div>
                  <button type="submit" tabIndex="12" className="contact-form-submit">
                    Submit Form
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
export default ContactForm
