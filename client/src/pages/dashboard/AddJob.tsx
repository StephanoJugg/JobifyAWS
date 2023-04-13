import { FormRow, FormRowSelect, Alert } from '../../components';
import { useAppContext } from '../../context/AppContext/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useAuthContext } from '../../context/AuthContext/AuthContext';

export default function AddJob() {
  const {
    showAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    isEditing,
    displayAlert,
    handleChange,
    clearValues,
    createJob,
    editJob,
  } = useAppContext();

  const { isLoading } = useAuthContext();

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!position || !company) {
      displayAlert();
      return;
    }
    if (isEditing) {
      editJob();
      return;
    }

    createJob();
  };

  const handleJobInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;

    console.log({ name, value });
    handleChange({ name, value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? 'edit job' : 'add job'} </h3>
        {showAlert && <Alert />}

        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="jobLocation"
            value={jobLocation}
            handleChange={handleJobInput}
          />
          <FormRowSelect
            name="jobType"
            value={jobType}
            selectValues={jobTypeOptions}
            handleChange={handleJobInput}
          />
          <FormRowSelect
            name="status"
            value={status}
            selectValues={statusOptions}
            handleChange={handleJobInput}
          />

          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>

            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
}
