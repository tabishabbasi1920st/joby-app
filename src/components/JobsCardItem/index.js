import {FaStar} from 'react-icons/fa'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobsCardItem = props => {
  const {eachJobObj} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = eachJobObj

  return (
    <Link to={`/jobs/${id}`}>
      <li className="job-card-container">
        <div className="job-card-icon-and-title-and-rating-container">
          <div className="company-logo-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="job-card-company-logo"
            />
          </div>
          <div className="job-card-title-and-rating-container">
            <h1 className="job-card-title">{title}</h1>
            <div className="star-icon-and-rating-container">
              <FaStar className="job-card-star-icon" />
              <p className="job-card-rating-para">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-card-location-and-job-type-container">
          <div className="location-icon-and-location-para-container">
            <HiLocationMarker className="location-icon" />
            <p className="job-card-location-para">{location}</p>
          </div>
          <div className="location-icon-and-location-para-container">
            <BsFillBriefcaseFill className="location-icon" />
            <p className="job-card-location-para">{employmentType}</p>
          </div>
        </div>
        <h1 className="description-para">Description</h1>
        <p className="job-card-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobsCardItem
