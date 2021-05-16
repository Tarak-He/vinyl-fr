import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';

import firebase from "firebase";

const Bookmarks = (props) => {

    const [results, setResults] = useState([]);
    const [eventsList, setEventsList] = useState([]);

    useEffect(()=>{



        // Create a reference to the cities collection
        var eventsRef = firebase.firestore().collection("event");

        // Create a query against the collection.
        // var query = eventsRef.where("bookmark", "==", props.location.bookmarks);
            eventsRef.get().then(eventDoc => {
                eventDoc.docs.map((snapshot) => 
                    // eventsList.push(snapshot.data())
                    console.log(snapshot.data())
                )
            }).catch(error => {
                console.log(error)
            })

        // query.get()
        // .then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         // doc.data() is never undefined for query doc snapshots
        //         console.log(doc.id, " => ", doc.data());
        //     });
        // })
        // .catch((error) => {
        //     console.log("Error getting documents: ", error);
        // });

    }, [])


    return(
        <div className="search-results">
            
            <h3>Événements enregistrés</h3>

            
            {
                results.length === 0 &&
                <div className="no-result-found">
                    <h5>
                        Vous n'avez ajouté aucun événement à votre liste.
                    </h5>
                    <NavLink to="/"><p style={{marginTop: "3rem"}}>Retour à l'accueil</p></NavLink>
                </div>
            }

            <div className="bookmarks-board-container">
            {/* {
                events.length > 2 && events.map((event, index)=>{
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
            } */}

            </div>

        </div>
    )
}

export default Bookmarks