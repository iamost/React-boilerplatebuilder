import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { logIn } from 'api/modules/auth'
import './styles.scss'

class LogIn extends Component {
  static propTypes = {
    logIn: PropTypes.func,
  }

  constructor(props) {
    super(props)
    
    this.state = {
      email: '',
      password: '',
      staySignedIn: false,
    }
  }

  componentDidMount() {
    if (window.location.href.indexOf("?token") >= 0) {
      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        "#/login";

      window.history.pushState({ path: newurl }, "", newurl);
    }
    if(this.props.state.auth.token) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(newProps) {
    if (window.location.href.indexOf("?token") >= 0) {
      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        "#/login";

      window.history.pushState({ path: newurl }, "", newurl);
    }
    if(newProps.state.auth.token) {
      newProps.history.push('/');
    }
  }

  handleChange = (field, evt) => {
    const { target: { type, checked, value } } = evt
    this.setState({
      [field]: type === 'checkbox' ? checked : value,
    })
  }

  handleSubmit = evt => {
    evt.preventDefault()
    const { logIn } = this.props
    logIn({ body: { ...this.state }, success: () => {this.props.history.push("/");} } )
  }

  render() {
    const { email, password, staySignedIn } = this.state

    return (
      <div className="loginPage">
        <div className="wrapper">
          <div className="loginForm">
            <div className="loginForm__title">
              <img src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/logo@3x.png" alt="" />
            </div>

            <div className="loginForm__content">
              {this.props.error && this.props.error.status === 401 &&
                <div className="red message" style={{marginBottom: "15px"}}><span>{this.props.error.data}</span><span><NavLink style={{cursor: "pointer", color: "rgb(16, 135, 188)"}} to="/recover/password">&nbsp;Forgot password?</NavLink></span></div>}
              {this.props.status === "RECOVER_PASSWORD/success" &&
                <div className="green message" style={{marginBottom: "15px"}}>We've sent an email with instructions on how to reset your password.</div>}
              {this.props.status === "NEW_PASSWORD/success" &&
                <div className="green message" style={{marginBottom: "15px"}}>Your password has been changed.</div>}
              <form onSubmit={this.handleSubmit}>
                <div>
                  <input className="field" placeholder="Email" type="email" onChange={evt => this.handleChange('email', evt)} value={email} required autoFocus />
                </div>
                <div>
                  <input className="field" placeholder="Password" type="password" onChange={evt => this.handleChange('password', evt)} value={password} required />
                </div>
                <div>
                  <button className="large form button">Sign in</button>
                </div>
                <div className="checkbox">
                  <input id="stay-signed-in" type="checkbox" checked={staySignedIn} onChange={evt => this.handleChange('staySignedIn', evt)} />
                  <div id="stay-signed-in-replacer" className={staySignedIn ? 'checked' : 'unchecked'} />
                  <label id="stay-signed-in-label">Stay signed in</label>
                </div>
                <div>
                  <NavLink to="/sign-up">Create account</NavLink>
                  <span>|</span>
                  <NavLink to="/recover/password">Reset password</NavLink>
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
      status: state.auth.status,
      state
  };
}

export default connect(mapStateToProps, {logIn})(LogIn);