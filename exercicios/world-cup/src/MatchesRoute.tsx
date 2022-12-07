import { useParams, useLoaderData } from "react-router-dom";
import { Match } from "./Match";

export default function MatchesRoute() {
  const { year } = useParams();
  const matches = useLoaderData() as Match[];

  return (
    <div>
      <h2>Matches of the World Cup {year}</h2>
      <table>
        <tbody>
          {matches.map((match, i) => (
            <tr key={i}>
              <td>{match.team1}</td>
              <td>
                {match.score1} X {match.score2}
              </td>
              <td>{match.team2}</td>
              <td>{match.stage}</td>
              <td>{match.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
