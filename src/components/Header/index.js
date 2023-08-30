import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiLogout} from 'react-icons/hi'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="header-main-bg-container">
      <nav className="navigation-bar-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-website-logo"
          />
        </Link>
        <ul className="nav-options-container">
          <Link to="/">
            <li>
              <AiFillHome className="nav-icons" />
            </li>
          </Link>
          <Link to="/jobs">
            <li>
              <BsFillBriefcaseFill className="nav-icons" />
            </li>
          </Link>
          <Link to="/login">
            <li>
              <HiLogout className="nav-icons" onClick={onClickLogoutButton} />
            </li>
          </Link>
        </ul>

        <div className="nav-lg-options-container">
          <Link to="/">
            <p className="nav-lg-options">Home</p>
          </Link>
          <Link to="/jobs">
            <p className="nav-lg-options">Jobs</p>
          </Link>
        </div>
        <div className="nav-logout-btn-container">
          <Link to="/login">
            <button
              onClick={onClickLogoutButton}
              type="button"
              className="nav-logout-btn"
            >
              Logout
            </button>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default withRouter(Header)
