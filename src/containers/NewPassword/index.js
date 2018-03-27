import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { newPassword } from 'api/modules/auth'
import './styles.scss'

import {checkPassStrength } from '../../utils/passwordHelper';

class NewPassword extends Component {
  constructor(props) {
    super(props)
    
    var search = window.location.href.split("?");
    const token = new URLSearchParams(search.length > 1 ? search[1].replace("#/","") : "").get("token");
    this.state = {
      password: '',
      confirmPassword: '',
      passwordsDontMatch: false,
      token
    }
  }

  componentDidMount(){
    this.passwordInput.focus();
  }

  validatePasswords = () => {
    if(this.state.password !== this.state.confirmPassword) {
      this.setState({
        passwordsDontMatch: true
      })
    } else {

      document.getElementById("confirmPassword").setCustomValidity("");

      this.setState({
        passwordsDontMatch: false
      });
    }
  }

  handleChange = (field, evt) => {
    const { value } = evt.target;

    this.setState({
      [field]: value,
    });
  };

  handleSubmit = evt => {        
    evt.preventDefault()

    if(this.state.passwordsDontMatch) {
      return;
    }

    const { newPassword } = this.props
    const { password, token } = this.state
    
    newPassword({ body: { password, token }, success: () => {window.location.href = "/#/login";  } } )
  }

  render() {
    const { password, confirmPassword } = this.state    

    const strength = checkPassStrength(password);


    if(this.state.passwordsDontMatch === true) {
      document.getElementById("confirmPassword").setCustomValidity("Passwords Don't Match");
    }

    return (

      <div className="recoverPasswordPage">
        <div className="wrapper">
          <div className="recoverPasswordForm">
            <div className="recoverPasswordForm__title">
              <img
                src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/logo@3x.png"
                alt=""
              />
            </div>

            <div className="recoverPasswordForm__content">              
              <form onSubmit={this.handleSubmit}>
                <div className="password-container">
                  <input className="field" placeholder="New Password" type="password" onChange={evt => this.handleChange('password', evt)} value={password} ref={(input) => { this.passwordInput = input; }} required />
                  {
                    password.length>0 && <div className={'validator' + (strength?' '+strength:'')}>{strength}</div>
                  }                  
                </div>
                <div>
                  <input
                    id="confirmPassword"
                    className="field"
                    placeholder="Confirm Password"
                    type="password"
                    onChange={evt => this.handleChange('confirmPassword', evt)}
                    value={confirmPassword}
                    required
                  />
                </div>
                <div>
                  <button onClick={this.validatePasswords} className="large form button">Set new password</button>
                </div>
                <div>
                  <a href="javascript:void" onClick={()=>{window.location.href = "/#/login";}}>Return to login</a>
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
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

const actions = {
  newPassword,
}

export default withRouter(connect(mapStateToProps, actions)(NewPassword))
