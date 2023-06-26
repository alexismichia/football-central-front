import axios from "axios";
import { GET_STANDINGS_LEAGUE } from "./actions-type";

export function getStandingsLeague(id){
    
    return async function (dispatch){
    let url;

    if (id === '636'){
        url = `/standings/20873?league_id=${id}`
    }
    if (id === '82'){
        url = `/standings/19744?league_id=${id}`
    }
    if (id === '85'){
        url = `/standings/19743?league_id=${id}`
    }
    if (id === '8'){
        url = `/standings/19734?league_id=${id}`
    }
    
    try {
        //CÓDIGO ASYNC
        let apiData = await axios.get(url);
        let standings = apiData.data;

        standings = standings.filter(t => t.points !== 0)
        
        const arrURLs = standings.map(t => {
            return `/team/${t.participant_id}`
        })

        const fetchTeam = (url) => {
            return axios.get(url)
            .then(response => response.data)
            .catch(error => {
                throw Error(error.message)
            })
        }

        const teamsInfo = arrURLs.map(url => fetchTeam(url))

        //[{...},{...},{...}]

        await Promise.all(teamsInfo)
        .then(response => {
            standings.forEach(position => {
                const teamInfo = response.find(team => 
                    team.id === position.participant_id)
                position.teamInfo = teamInfo
            });
        })

        console.log(standings, 'Action')

        return dispatch({
            type: GET_STANDINGS_LEAGUE,
            payload: standings
        })
        
        //CÓDIGO SYNC
        // let apiData = await axios.get(url);
        // let standings = apiData.data;

        // for (const position of standings) {
        //     if (position.points !== 0) {
        //         const team = await axios.get(`http://localhost:3001/team/${position.participant_id}`);
        //         position.teamInfo = team.data;
        //     }
        // }

        // standings = standings.filter((position) => position.points !== 0);
        


        // return dispatch({
        //   type: 'GET_STANDINGS_LEAGUE',
        //   payload: standings
        // });
      } catch (error) {
        
        alert('No se puede acceder al detail de esta liga')
        
      }

    }
}