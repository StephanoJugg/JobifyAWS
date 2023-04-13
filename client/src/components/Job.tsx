import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

interface JobProps {
  _id: string;
  position?: string;
  company?: string;
  jobLocation?: string;
  jobType?: string;
  createdAt?: string;
  status?: string;
}

export default function Job({
  _id,
  company,
  position,
  jobLocation,
  jobType,
  status,
  createdAt,
}: JobProps) {
  let date = moment(createdAt).format('MMM Do, YYYY');
  const { setEditJob, deleteJob } = useAppContext();

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company!.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation!} />
          <JobInfo icon={<FaBriefcase />} text={jobType!} />
          <JobInfo icon={<FaCalendarAlt />} text={date!} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-job"
              className="btn edit-btn"
              onClick={() => setEditJob(_id)}
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deleteJob(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
}
