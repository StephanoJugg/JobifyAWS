import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { StatsContainer, ChartsContainer, Loading } from "../../components";
import { useAppContext } from "../../context/appContext";

export default function Stats() {
  // const { showStats, isLoading, monthlyApplications, stats } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log(monthlyApplications);
    // showStats();
    API.get("jobs", "/stats", {});
  }, []);

  if (isLoading) return <Loading center />;

  return (
    <>
      <StatsContainer />
      {/* {monthlyApplications.length > 0 && <ChartsContainer />} */}
    </>
  );
}
