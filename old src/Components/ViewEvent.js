import React, { useEffect, useState, useContext } from 'react'
import { BsBookmark } from "react-icons/bs";
import { FaShareAlt } from "react-icons/fa";

import firebase from "firebase";


import UserContext from "../User/UserContext";

const ViewEvent = (props) => {

    
    const userData = useContext(UserContext);

    const [event, setEvent] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)

    const [userBookmarks, setUserBookmarks] = useState([])


    useEffect(() => {

        if (typeof props.location.state !== 'undefined') {
            if (props.location.state.hasOwnProperty('event')) {
                setEvent(props.location.state.event)
                setIsLoaded(true)
            } else if (props.location.state.hasOwnProperty('event') === 'undefined') {
                console.log('halp')
            } 
        }



    }, [props.location.state, props.history, props.match.params.id, event, userData.id
        ])


        const handleBookmark = () => {
            
            firebase.firestore().collection('user').doc(userData.id)
            .get().then((snapshot)=>{
                setUserBookmarks(snapshot.data().bookmarks);
                console.log(snapshot.data())
                userBookmarks.push(event.id);
                console.log(userBookmarks)
            })
            
                firebase.firestore().collection('user').doc(userData.id)
                .update({
                    bookmarks: userBookmarks,
                })
                .then(()=>{alert('ok')})
                .catch(error=>console.log(error))
        }



    return (
        <div className="view-event" style={{backgroundImage: `url('${event.photoBg}')`}}>
            <button onClick={()=>{props.history.goBack()}}>PRECEDENT</button>
            <button onClick={()=>{console.log(event)}}>EVENT</button>
            { isLoaded &&
                    (
                        <div className="event-info">
                            <div className="ei1C1">


                                <div className="ei1Name">
                                    <p>{event.name}</p>
                                </div>


                                <div className="ei1Details">
                                    <div className="e1DL">
                                        <p>{event.artist}</p>
                                        <div className="e1DLTags">
                                            <span>Rappeur</span>
                                            <span>Réalisateur</span>
                                        </div>
                                    </div>
                                    <div className="e1DR">
                                        <div className="e1DR2">
                                            <div style={{marginRight: "2rem"}}>
                                                <p style={{fontSize: "1.5rem" ,fontWeight: '600'}}>Le {event.eventDate}</p>
                                                <p style={{fontSize: "1.3rem"}}>{event.address}</p>
                                            </div>
                                            <div className="e1DR2social">
                                                <BsBookmark onClick={()=>{handleBookmark()}} className="ve-bookmark-icon"/>
                                                <FaShareAlt />
                                            </div>
                                        </div>

                                        <div className="e1DRTags">
                                            <span>Rap</span>
                                            <span>Hiphop</span>
                                        </div>
                                    </div>
                                </div>


                                <div>
                                    <button className="ei1Button">Lien vers l'événement</button>
                                </div>

                            </div>


                            <div className="ei1C2">
                                <p className="ei1subtitle">{event.subTitle}</p>
                                <p className="ei1subdescription">{event.subDescription}</p>
                            </div>
                        </div>
                    )
            }
        </div>
    )



}

export default ViewEvent