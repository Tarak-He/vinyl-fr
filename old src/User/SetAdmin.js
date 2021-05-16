import React, {useContext} from 'react';

import firebase from '../Config/Firebase'

import UserContext from "./UserContext"

const SetAdmin = () => {

    
    const userData = useContext(UserContext);
    console.log(userData)

    const PromoteToAdmin = (e) => {
        e.preventDefault();
        const [requestedId] = e.target.elements;
        console.log(requestedId.value)
        firebase.firestore().collection('user').doc(requestedId.value).get()
        .then((userData) => {
            console.log(userData.data())
        }).catch(error=>{
            console.log(error)
        })
            // console.log(userData.data())

            // if(userData.data().role !== "admin") {
            //     firebase.firestore().collection('user').doc(requestedId.value)
            //     .update({
            //         role: "admin"
            //     }).then(() => {
            //         alert("User " + requestedId.value + ' was correctly upgraded')
            //     })
            //     .catch(error => {
            //         console.log(error)
            //     })
            // } else {
            //     alert(userData.data().firstName + " already has an ADMIN role")
            // }
            // }).catch(error => {
            //     console.log(error)
            //     alert('Wrong User ID')
            // })


    }



    const DowngradeToUser = (e) => {
        e.preventDefault();
        const [requestedId] = e.target.elements;

        firebase.firestore().collection('Users').doc(requestedId.value).get()
        .then((userData) => {
            if(userData.data().role !== "user") {
                firebase.firestore().collection('Users').doc(requestedId.value)
                .update({
                    role: "user"
                }).then(() => {
                    alert("User " + requestedId.value + ' was correctly downgraded')
                })
                .catch(error => {
                    console.log(error)
                })
            } else {
                alert(userData.data().firstName + " already has a USER role")
            }
        }).catch(error => {
            console.log(error)
            alert('Wrong User ID')
        })


    }

    return (
        <div className="setadmin" style={{paddingTop: '10vh'}}>
            <form onSubmit={PromoteToAdmin}>
                <input type="text" placeholder="User id here..." />
                <button type="submit" style={{color: 'green'}}>Promote to admin</button>
            </form>
            <form onSubmit={DowngradeToUser}>
                <input type="text" placeholder="User id here..." />
                <button type="submit" style={{color: 'red'}}>Downgrade to user</button>
            </form>
        </div>
    )

}

export default SetAdmin;