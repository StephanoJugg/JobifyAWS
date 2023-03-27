import { useEffect } from "react";
import { StatsContainer, ChartsContainer, Loading } from "../../components";
import { useAppContext } from "../../context/appContext";

export default function Stats() {
  const { showStats, isLoading, monthlyApplications, stats } = useAppContext();

  useEffect(() => {
    console.log(monthlyApplications);
    showStats();
  }, []);

  if (isLoading) return <Loading center />;

  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
}
