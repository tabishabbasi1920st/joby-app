import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

export default class Login extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    isCredentialValid: true,
    errorText: '',
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {username: usernameInput, password: passwordInput}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok) {
      this.setState({isCredentialValid: true})
      const jwtToken = fetchedData.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 10})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({
        isCredentialValid: false,
        errorText: fetchedData.error_msg,
      })
    }
  }

  renderUserNameField = () => {
    const {usernameInput} = this.state
    return (
      <>
        <div className="label-container">
          <label className="label" htmlFor="userName">
            USERNAME
          </label>
        </div>
        <input
          type="text"
          id="userName"
          className="input-field"
          placeholder="Username"
          value={usernameInput}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {passwordInput} = this.state
    return (
      <>
        <div className="label-container">
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
        </div>
        <input
          type="password"
          id="password"
          className="input-field"
          placeholder="Password"
          value={passwordInput}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const {isCredentialValid, errorText} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-route-app-container">
        <div className="login-route-form-and-icon-container">
          <div className="login-route-form-icon">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <form onSubmit={this.onSubmitLoginForm}>
            <div className="form-input-field-container">
              {this.renderUserNameField()}
            </div>
            <div className="form-input-field-container">
              {this.renderPasswordField()}
            </div>
            <button type="submit" className="login-route-login-btn">
              Login
            </button>
            {isCredentialValid === false && (
              <p
                className="login-form-error-msg
            "
              >
                *{errorText}
              </p>
            )}
          </form>
        </div>
      </div>
    )
  }
}
