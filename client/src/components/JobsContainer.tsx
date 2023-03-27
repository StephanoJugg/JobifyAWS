import { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/JobsContainer";
import Loading from "./Loading";
import Job from "./Job";
import PageBtnContainer from "./PageBtnContainer";

export default function JobsContainer() {
  const {
    getJobs,
    allJobs,
    isLoading,
    page,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
  } = useAppContext();

  useEffect(() => {
    getJobs();
  }, [page, search, searchStatus, searchType, sort]);

  if (isLoading) {
    return <Loading center></Loading>;
  }

  if (allJobs && allJobs.length < 1) {
    return (
      <Wrapper>
        <div className="jobs-center">
          <h3>No jobs to display</h3>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} job{allJobs.length > 1 && "s"}
      </h5>
      <div className="jobs">
        {allJobs.map((job) => {
          return <Job key={job._id} {...job}></Job>;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
}
