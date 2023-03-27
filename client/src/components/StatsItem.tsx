import Wrapper from "../assets/wrappers/StatItem";

interface IStatsItem {
  count: number;
  title: string;
  icon: JSX.Element;
  color: string;
  bcg: string;
}

export default function StatsItem({
  count,
  title,
  icon,
  color,
  bcg,
}: IStatsItem) {
  return (
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className="count">{count}</span>
        <div className="icon">{icon}</div>
      </header>
      <h5 className="title">{title}</h5>
    </Wrapper>
  );
}
