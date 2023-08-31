/*eslint-disable*/
import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'
import Header from '../Header'
import Filters from '../Filters'
import JobsCardItem from '../JobsCardItem'

const ApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJobFound: 'NO_JOB_FOUND',
}

export default class Jobs extends Component {
  state = {
    userProfileObj: {},
    profileApiStatus: ApiStatusConstants.initial,
    selectedSalaryRange: '',
    typesOfEmploymentList: [
      {id: 'INTERNSHIP', status: false},
      {id: 'FREELANCE', status: false},
      {id: 'PARTTIME', status: false},
      {id: 'FULLTIME', status: false},
    ],
    searchInput: '',
    jobsApiStatus: ApiStatusConstants.initial,
    jobsList: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: ApiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const apiUrl = 'https://apis.ccbp.in/profile'

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const profileDetails = fetchedData.profile_details
      const updatedData = {
        profileImageUrl: profileDetails.profile_image_url,
        name: profileDetails.name,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        userProfileObj: updatedData,
        profileApiStatus: ApiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: ApiStatusConstants.failure})
    }
  }

  getJobsDetails = async () => {
    const {jobsList} = this.state
    this.setState({jobsApiStatus: ApiStatusConstants.inProgress})
    const {typesOfEmploymentList, searchInput, selectedSalaryRange} = this.state
    const selectedEmploymentTypes = typesOfEmploymentList.filter(eachObj => {
      if (eachObj.status === true) {
        return eachObj.id
      }
    })

    let selectedOptionList = []

    for (let eachObj of selectedEmploymentTypes) {
      selectedOptionList.push(eachObj.id)
    }

    const employmentTypes = selectedOptionList.join()
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${selectedSalaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const jobsList = fetchedData.jobs
      const updatedJobsList = jobsList.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobsList: updatedJobsList,
        jobsApiStatus: ApiStatusConstants.success,
      })

      if (jobsList.length === 0) {
        this.setState({jobsApiStatus: ApiStatusConstants.noJobFound})
      }
    } else {
      this.setState({jobsApiStatus: ApiStatusConstants.failure})
    }
  }

  onEmptySearchBar = () => {
    const {searchInput} = this.state
    if (searchInput === '') {
      this.getJobsDetails()
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.onEmptySearchBar)
  }

  onClickSearchIcon = () => this.getJobsDetails()

  renderSearchBox = () => {
    const {searchInput} = this.state
    return (
      <div className="search-box-container">
        <input
          placeholder="Search"
          type="search"
          className="search-input"
          onChange={this.onChangeSearchInput}
          value={searchInput}
        />
        <div className="search-icon-container">
          <button type="button" data-testid="searchButton">
            <BsSearch
              className="search-icon"
              onClick={this.onClickSearchIcon}
            />
          </button>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <>
      <div className="profile-failure-retry-btn-container">
        <button
          onClick={this.getProfileDetails}
          type="button"
          className="profile-failure-retry-btn"
        >
          Retry
        </button>
      </div>
    </>
  )

  renderUserProfile = () => {
    const {userProfileObj, profileApiStatus} = this.state
    const {profileImageUrl, name, shortBio} = userProfileObj

    switch (profileApiStatus) {
      case ApiStatusConstants.success:
        return (
          <div className="user-profile-container">
            <div className="user-profile-dp-container">
              <img
                src={profileImageUrl}
                alt="profile"
                className="user-dp-icon"
              />
            </div>
            <h1 className="username-para">{name}</h1>
            <p className="user-description">{shortBio}</p>
          </div>
        )
      case ApiStatusConstants.inProgress:
        return this.renderLoader()
      case ApiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  changeSelectedSalaryRange = selectedSalaryRangeId => {
    this.setState(
      {selectedSalaryRange: selectedSalaryRangeId},
      this.getJobsDetails,
    )
  }

  changeTypesOfEmploymentCheckbox = uniqueCheckboxEvent => {
    const {typesOfEmploymentList} = this.state
    const clickedCheckboxId = uniqueCheckboxEvent.target.id
    const clickedCheckboxStatus = uniqueCheckboxEvent.target.checked

    this.setState(
      prevState => ({
        typesOfEmploymentList: prevState.typesOfEmploymentList.map(eachObj => {
          if (eachObj.id === clickedCheckboxId) {
            return {...eachObj, status: clickedCheckboxStatus}
          } else {
            return eachObj
          }
        }),
      }),
      this.getJobsDetails,
    )
  }

  renderFilters = () => {
    const {typesOfEmploymentList} = this.state
    return (
      <Filters
        changeSelectedSalaryRange={this.changeSelectedSalaryRange}
        changeTypesOfEmploymentCheckbox={this.changeTypesOfEmploymentCheckbox}
      />
    )
  }

  onClickJobsRetryBtn = () => {
    this.getJobsDetails()
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
          onClick={this.onClickJobsRetryBtn}
          className="job-route-failure-view-btn"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobsNotFoundView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="job-route-failure-img"
      />
      <div className="job-route-failure-view-btn-and-content-container">
        <p className="job-route-failure-view-oops">No Jobs Found</p>
        <p className="job-route-failure-view-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    </div>
  )

  renderJobs = () => {
    const {jobsList, jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case ApiStatusConstants.success:
        return jobsList.map(eachJobObj => (
          <JobsCardItem key={eachJobObj.id} eachJobObj={eachJobObj} />
        ))
        break
      case ApiStatusConstants.inProgress:
        return this.renderLoader()
        break
      case ApiStatusConstants.failure:
        return this.renderJobsFailureView()
        break
      case ApiStatusConstants.noJobFound:
        return this.renderJobsNotFoundView()
        break
      default:
        return null
        break
    }
  }

  render() {
    const {jobsList, jobsApiStatus} = this.state

    console.log(jobsApiStatus)

    return (
      <div className="jobs-main-bg-container">
        <Header />
        <div className="job-bg-content-container">
          <div className="job-content-container">
            {this.renderSearchBox()}
            <div className="user-profile-holder-container">
              {this.renderUserProfile()}
            </div>
            {this.renderFilters()}
          </div>
          <ul className="jobs-card-container">{this.renderJobs()}</ul>
        </div>
      </div>
    )
  }
}
