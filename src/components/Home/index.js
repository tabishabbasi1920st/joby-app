import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

class Home extends Component {
  render() {
    return (
      <div className="home-page-main-bg-container">
        <Header />
        <div className="home-page-content-container">
          <div className="home-banner-content-container">
            <h1 className="home-banner-content-heading">
              Find The Job That Fits Your Life
            </h1>
            <p className="home-banner-content-para">
              Millions of People are searching for jobs, salary information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button type="button" className="find-jobs-btn">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
