import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { recoverPassword } from 'api/modules/auth'
import './styles.scss'

class RecoverPassword extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  handleChange = (field, evt) => {
    const { value } = evt.target

    this.setState({
      [field]: value,
    })

  }

  handleSubmit = evt => {
    evt.preventDefault()
    const { recoverPassword } = this.props
    recoverPassword({ body: { ...this.state }, success: () => {this.props.history.push("/login");} } )        
  }

  render() {
    const { email } = this.state

    return (
      <div className="recoverPasswordPage">
        <div className="wrapper">
          <div className="recoverPasswordForm">
            <div className="recoverPasswordForm__title">
              <img src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/logo@3x.png" alt="" />
            </div>

            <div className="recoverPasswordForm__content">
              <form onSubmit={this.handleSubmit}>
                <div>
                  <input className="field" placeholder="Email" type="email" onChange={evt => this.handleChange('email', evt)} value={email} required autoFocus />
                </div>
                <div>
                  <button className="large form button">Recover</button>
                </div>
                <div>
                  <NavLink to="/login">Return to login</NavLink>
                </div>
              </form>
            </div>
          </div>
          <p className="contactUs">
            <a href="mailto:support@boilerplatebuilder.com">Contact us</a>
          </p>
          <p className="copyRight">© Breck Inc. 2018, All Rights Reserved</p>
        </div>
        <button className="general-help-button">?</button>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
      error: state.auth.error,
      state
  };
}

export default withRouter(connect(mapStateToProps, {recoverPassword})(RecoverPassword));
