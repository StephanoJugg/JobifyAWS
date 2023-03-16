import { Outlet, Link } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";

export default function Profile() {
  return (
    <Wrapper>
      <nav>
        <Link to="add-job">add job</Link>
        <Link to="all-jobs">all jobs</Link>
      </nav>
    </Wrapper>
  );
}
