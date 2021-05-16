// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';

const SearchResults = (props) => {

    const [request, setRequest] = useState('');
    const [results, setResults] = useState([]);


    useEffect(()=>{
        if (props.location.state === undefined) {
            props.history.push('/')
        } else {
            setRequest(props.location.state.request);
            setResults(props.location.state.results);
        }
    }, [props.history, props.location.state])
// const SearchResults = (props) => {

    return(
        <div className="search-results">
            
            <h3>Résultats de la recherche <span className="fx1">{request}</span></h3>
            {
                request.length<3 && <pre>La recherche doit contenir au moins 3 caractères</pre>
            }
            
            {
                results.length === 0 &&
                <div className="no-result-found">
                    <h4>
                        Aucun résultat n'a été trouvé
                    </h4>
                    <NavLink to="/"><p style={{marginTop: "3rem"}}>Retour à l'accueil</p></NavLink>
                </div>
            }

            <div className="events-home">
            {
                request.length > 2 && results.map((event, index)=>{
                    return (
                        <div className="event-box" key={index}>
                            <NavLink to={{
                                pathname: "/event/" + event.id,
                                state: {event: event}
                            }}>
                                <img className="event-box-img" src={event.photoBg} alt="event default" />
                                <div className="ebiDetails">
                                    <h3>{event.artist}</h3>
                                    <h5>{event.address}</h5>
                                    <h5>{event.eventDate}</h5>
                                </div>
                            </NavLink>
                        </div>
                    )
                })
            }

            </div>

        </div>
    )
}

export default SearchResults