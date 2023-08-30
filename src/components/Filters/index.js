import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const Filters = props => {
  const {changeSelectedSalaryRange, changeTypesOfEmploymentCheckbox} = props

  const onSelectionRadioButton = event => {
    const selectedSalaryRangeOptionId = event.target.value
    changeSelectedSalaryRange(selectedSalaryRangeOptionId)
  }

  let checkboxValue
  const onChangeTypeOfJobsCheckbox = event => {
    checkboxValue = event.target.checked
    changeTypesOfEmploymentCheckbox(event)
  }

  const renderTypeOfEmployment = () => (
    <ul className="filter-container">
      <h1 className="filter-main-para">Type of Employment</h1>
      {employmentTypesList.map(eachObj => (
        <li key={eachObj.employmentTypeId} className="each-filter-item">
          <input
            type="checkbox"
            className="checkbox"
            id={eachObj.employmentTypeId}
            onChange={onChangeTypeOfJobsCheckbox}
            value={checkboxValue}
          />
          <label
            htmlFor={eachObj.employmentTypeId}
            className="each-filter-label"
          >
            {eachObj.label}
          </label>
        </li>
      ))}
    </ul>
  )

  const renderSalaryRange = () => (
    <ul className="salary-filter-container" onChange={onSelectionRadioButton}>
      <h1 className="filter-main-para">Salary Range</h1>

      {salaryRangesList.map(eachObj => (
        <li key={eachObj.salaryRangeId} className="each-filter-item">
          <input
            type="radio"
            className="radio"
            value={eachObj.salaryRangeId}
            name="salary"
            id={eachObj.salaryRangeId}
          />
          <label htmlFor={eachObj.salaryRangeId} className="each-filter-label">
            {eachObj.label}
          </label>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {renderTypeOfEmployment()}
      {renderSalaryRange()}
    </>
  )
}

export default Filters
