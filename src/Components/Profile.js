import React, { useContext, useEffect } from 'react';

import firebase from '../Config/Firebase'

import UserContext from "../User/UserContext"

const Profile = () => {

    const userData = useContext(UserContext);
    
    useEffect(()=>{

    }, [userData])

    return userData && (
        <div className="profile-main-container">
            <h3>Profile</h3>
            <h2>{userData.email}</h2>
            <p>Inscrit depuis :</p>
            <p>{userData.createdAt}</p>
        </div>
    )

}

export default Profile;