import { useSelector } from "react-redux";
import moment from "moment";
import MatchCard from "../MatchCard/MatchCard";
import LivescoreCard from '../../components/LivescoreCard/LivescoreCard'

const MatchCards = () => {
  const fixtureByDateRange = useSelector((state) => state.fixtureByDateRange);
  const livescores = useSelector((state) => state.latestLivescores);

  const timeZone = 3;
 

  const formatMatch = (matches) => {
    return matches.map((match) => {
      const matchDate = moment(match.starting_at)
        .subtract(timeZone, "hours")
        .format("YYYY-MM-DD");
      const matchHour = moment(match.starting_at)
        .subtract(timeZone, "hours")
        .format("HH:mm");
      return { ...match, starting_at: `${matchDate} ${matchHour}` };
    });
  };

  const fixture = formatMatch(fixtureByDateRange);
  const fixtureLive = formatMatch(livescores);

  const today = moment().format("YYYY-MM-DD");
  const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");
  const dayAfterTomorrow = moment().add(2, "days").format("YYYY-MM-DD");

  const todayMatches = fixture.filter((match) => {
    const matchDate = match.starting_at.split(" ")[0];
    return (
      matchDate === today /* && match.league_id === 636 && match.state !== 5  */
    );
  });

  const tomorrowMatches = fixture.filter((match) => {
    const matchDate = match.starting_at.split(" ")[0];
    return (
      matchDate ===
      tomorrow /* && match.league_id === 636 && match.state !== 5 */
    );
  });

  const dayAfterTomorrowMatches = fixture.filter((match) => {
    const matchDate = match.starting_at.split(" ")[0];
    return (
      matchDate ===
      dayAfterTomorrow /* && match.league_id === 636 && match.state !== 5*/
    );
  });


  const renderMatches = (matches) => {
    return matches
      .slice(0, 4)
      .map((match) => (
        <MatchCard
          key={match.id}
          home={
            match.participants?.[0]?.name || match.name.split("vs")[0].trim()
          }
          homeLogo={match.participants?.[0]?.image_path}
          away={
            match.participants?.[1]?.name || match.name.split("vs")[1].trim()
          }
          awayLogo={match.participants?.[1]?.image_path}
          homeScore={
            match.scores &&
            match.scores.find(
              (item) =>
                item.description === "CURRENT" &&
                item.score.participant === "home"
            )?.score?.goals
          }
          awayScore={
            match.scores &&
            match.scores.find(
              (item) =>
                item.description === "CURRENT" &&
                item.score.participant === "away"
            )?.score?.goals
          }
          hour={match.starting_at?.split(" ")[1]?.trim()}
        />
      ));
  };
  const renderLivescores = (matches) => {
    return matches
      .slice(0, 4)
      .map((match) => (
        <LivescoreCard
          key={match.id}
          home={
            match.participants?.[0]?.name || match.name.split("vs")[0].trim()
          }
          homeLogo={match.participants?.[0]?.image_path}
          away={
            match.participants?.[1]?.name || match.name.split("vs")[1].trim()
          }
          awayLogo={match.participants?.[1]?.image_path}
          homeScore={
            match.scores &&
            match.scores.find(
              (item) =>
                item.description === "CURRENT" &&
                item.score.participant === "home"
            )?.score?.goals
          }
          awayScore={
            match.scores &&
            match.scores.find(
              (item) =>
                item.description === "CURRENT" &&
                item.score.participant === "away"
            )?.score?.goals
          }
          state={
            match.state?.id === 2
              ? "PT"
              : match.state?.id === 22
              ? "ST"
              : match.state?.id === 3
              ? "ET"
              : ""
          }
          time={match.periods?.[match.periods.length - 1]?.minutes || ""}
        />
      ));
  };

  return (
    <div className="md:absolute md:top-[600px] md:w-[50%] md:ml-16 bg-pf-dark-grey md:flex md:flex-col md:justify-center pl-[10px] pt-3 md:rounded-xl">
      {/* partidos en vivo */}
      <div className="md:h-72 flex md:flex-col justify-start gap-3 pt-3">
        <div className="md:flex md:justify-start md:items-center md:w-[85%] text-lg md:ml-1 bg-transparent md:border-2 md:border-y-2 md:border-x-0 border-b-pf-white">
          <h3 className="text-pf-white md:text-base md:font-extralight md:pl-5">
            EN VIVO
          </h3>
        </div>
        <div className="h-68 w-full px-2 gap-x-4 flex flex-row justify-start items-center whitespace-nowrap overflow-x-auto sm:w-full md:flex md:flex-row md:flex-wrap md:justify-start md:gap-2">
          {renderLivescores(fixtureLive)}
        </div>
      </div>

      {/* partidos de hoy */}
      <div className="md:h-72 flex md:flex-col justify-start gap-3 pt-3">
        <div className="md:flex md:justify-start md:items-center md:w-[85%] text-lg md:ml-1 bg-transparent md:border-2 md:border-y-2 md:border-x-0 border-b-pf-white">
          <h3 className="text-pf-white md:text-base md:font-extralight md:pl-5">
            HOY
          </h3>
        </div>
        <div className="h-80 w-full px-2 gap-x-2 flex flex-row justify-start items-center whitespace-nowrap overflow-x-auto sm:w-full md:flex md:flex-row md:flex-wrap md:justify-start md:gap-2">
          {renderMatches(todayMatches)}
        </div>
      </div>

      {/* partidos de mañana */}
      <div className="md:h-72 flex md:flex-col justify-start gap-3 pt-3">
        <div className="md:flex md:justify-start md:items-center md:w-[85%] text-lg md:ml-1 bg-transparent md:border-2 md:border-y-2 md:border-x-0 border-b-pf-white">
          <h3 className="text-pf-white md:text-base md:font-extralight md:pl-5">
            MAÑANA
          </h3>
        </div>
        <div className="h-80 w-full px-2 gap-x-2 flex flex-row justify-start items-center whitespace-nowrap overflow-x-auto sm:w-full md:flex md:flex-row md:flex-wrap md:justify-start md:gap-2">
          {renderMatches(tomorrowMatches)}
        </div>
      </div>

      {/* partidos de pasado mañana */}
      <div className="md:h-72 flex md:flex-col justify-start gap-3 pt-3">
        <div className="md:flex md:justify-start md:items-center md:w-[85%] text-lg md:ml-1 bg-transparent md:border-2 md:border-y-2 md:border-x-0 border-b-pf-white">
          <h3 className="text-pf-white md:text-base md:font-extralight md:pl-5">
            PASADO MAÑANA
          </h3>
        </div>
        <div className="h-80 w-full px-2 gap-x-2 flex flex-row justify-start items-center whitespace-nowrap overflow-hidden sm:w-full md:flex md:flex-row md:flex-wrap md:justify-start md:gap-2">
          {renderMatches(dayAfterTomorrowMatches)}
        </div>
      </div>
    </div>
  );
};

export default MatchCards;
