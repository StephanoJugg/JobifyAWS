import React, { useEffect, useState } from "react";

import Wrapper from "../assets/wrappers/ChartsContainer";
import { useAppContext } from "../context/appContext";
import BarChart from "./BarChart";

export default function ChartsContainer() {
  const [barChart, setBarChart] = useState(false);
  const { monthlyApplications: data } = useAppContext();

  return (
    <Wrapper>
      <h4>Montly Application</h4>

      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? "Area Chart" : "Bar Chart"}
      </button>
      <BarChart data={data} />
    </Wrapper>
  );
}
