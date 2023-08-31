import {Component} from 'react'
import {FaStar} from 'react-icons/fa'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {BiLinkExternal} from 'react-icons/bi'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Cookies from 'js-cookie'
import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

export default class JobItemDetails extends Component {
  state = {
    jobDetailsObj: {},
    similarJobDetailsList: [],
    jobDetailsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSpecificPageDetails()
  }

  getSpecificPageDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs

      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills,
        title: jobDetails.title,
      }

      const updatedSimilarJobs = similarJobs.map(eachObj => ({
        companyLogoUrl: eachObj.company_logo_url,
        employmentType: eachObj.employment_type,
        id: eachObj.id,
        jobDescription: eachObj.job_description,
        location: eachObj.location,
        rating: eachObj.rating,
        title: eachObj.title,
      }))

      this.setState({
        jobDetailsObj: updatedJobDetails,
        similarJobDetailsList: updatedSimilarJobs,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  pageDetailsOnClickJobsRetryBtn = () => {
    this.getSpecificPageDetails()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-route-failure-img"
      />
      <div className="job-route-failure-view-btn-and-content-container">
        <p className="job-route-failure-view-oops">
          Oops! Something Went Wrong
        </p>
        <p className="job-route-failure-view-description">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          type="button"
          onClick={this.pageDetailsOnClickJobsRetryBtn}
          className="job-route-failure-view-btn"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderSimilarJobsCard = () => {
    const {similarJobDetailsList} = this.state
    return (
      <>
        <div className="similar-jobs-heading-container">
          <h1 className="similar-jobs-para">Similar Jobs</h1>
        </div>
        <ul className="similar-jobs-card-container">
          {similarJobDetailsList.map(eachObj => (
            <li key={eachObj.id} className="similar-card">
              <div className="job-card-icon-and-title-and-rating-container">
                <div className="company-logo-container">
                  <img
                    src={eachObj.companyLogoUrl}
                    alt="similar job company logo"
                    className="job-card-company-logo"
                  />
                </div>
                <div className="job-card-title-and-rating-container">
                  <h1 className="job-card-title">{eachObj.title}</h1>
                  <div className="star-icon-and-rating-container">
                    <FaStar className="job-card-star-icon" />
                    <p className="job-card-rating-para">{eachObj.rating}</p>
                  </div>
                </div>
              </div>
              <div className="job-card-location-and-job-type-container">
                <div className="location-icon-and-location-para-container">
                  <HiLocationMarker className="location-icon" />
                  <p className="job-card-location-para">{eachObj.location}</p>
                </div>
                <div className="location-icon-and-location-para-container">
                  <BsFillBriefcaseFill className="location-icon" />
                  <p className="job-card-location-para">
                    {eachObj.employmentType}
                  </p>
                </div>
              </div>
              <h1 className="description-para">Description</h1>
              <p className="job-card-description">{eachObj.jobDescription}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderSkills = () => {
    const {
      jobDetailsObj,
      jobDetailsApiStatus,
      similarJobDetailsList,
    } = this.state
    const {skills, lifeAtCompany} = jobDetailsObj
    console.log(similarJobDetailsList)

    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return (
          <>
            <ul className="job-details-skills-container">
              {skills.map(eachObj => (
                <li key={eachObj.name} className="each-skills-container">
                  <img
                    src={eachObj.image_url}
                    alt={eachObj.name}
                    className="job-details-skills-img"
                  />
                  <p className="job-details-skills-name">{eachObj.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="job-details-life-at-company-para">
              Life at Company
            </h1>
            <div className="life-at-company-main-container">
              <p className="job-details-life-at-company-description">
                {lifeAtCompany.description}
              </p>
              <img
                src={lifeAtCompany.image_url}
                alt="life at company"
                className="job-details-life-at-company-img"
              />
            </div>
          </>
        )
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  render() {
    const {jobDetailsObj} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetailsObj

    console.log(lifeAtCompany)

    return (
      <div className="details-page-main-bg-container">
        <Header />
        <div className="details-page-container">
          <div className="job-card-icon-and-title-and-rating-container">
            <div className="company-logo-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="job details company logo"
              />
            </div>
            <div className="job-card-title-and-rating-container">
              <p className="job-card-title">{title}</p>
              <div className="star-icon-and-rating-container">
                <FaStar className="job-card-star-icon" />
                <p className="job-card-rating-para">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-card-location-and-job-type-containers">
            <div className="location-and-employment-type-container">
              <div className="location-icon-and-location-para-container">
                <HiLocationMarker className="location-icon" />
                <p className="job-card-location-para">{location}</p>
              </div>
              <div className="location-icon-and-location-para-container">
                <BsFillBriefcaseFill className="location-icon" />
                <p className="job-card-location-para">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <div className="description-para-and-website-link-container">
            <h1 className="description-para">Description</h1>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <a
                className="visit-anchor"
                href={companyWebsiteUrl}
                rel="noreferrer"
                target="_blank"
              >
                <BiLinkExternal
                  className="link-icon"
                  onClick={this.onClickUrlArrow}
                />
                Visit
              </a>
            </div>
          </div>
          <p className="job-card-description">{jobDescription}</p>
          <h1 className="job-details-skills-heading">Skills</h1>
          {this.renderSkills()}
        </div>

        {this.renderSimilarJobsCard()}
      </div>
    )
  }
}
