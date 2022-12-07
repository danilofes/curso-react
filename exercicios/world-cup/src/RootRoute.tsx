import { Outlet, NavLink, useNavigation } from "react-router-dom";

export default function RootRoute() {
  const years: number[] = [];
  for (let i = 1950; i <= 2018; i += 4) {
    years.push(i);
  }

  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <div className="worldCup">
      <header>
        <h1>World Cup App {loading && <span className="loading" />}</h1>
      </header>
      <nav>
        <h2>Year</h2>
        {years.map((year) => (
          <div key={year}>
            <NavLink to={`matches/${year}`}>{year}</NavLink>
          </div>
        ))}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
