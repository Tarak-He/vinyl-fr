import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import NewEvent from "./Components/NewEvent";
import SearchResults from "./Components/SearchResults";
import ViewEvent from "./Components/ViewEvent";

import firebase from "./Config/Firebase";
import UserContext from './User/UserContext';

import { GiHamburgerMenu } from "react-icons/gi";
import { CgClose } from "react-icons/cg";

import Loader from "./Components/Loader";

import logo1 from "./img/logo-1.png"
import loupe from "./img/glass.svg"

// import eventBoxDefaultImg from "./img/event-default.jpg"
// import eventBoxDefaultImg2 from "./img/event-default2.jpg"
// import eventBoxDefaultImg3 from "./img/event-default3.jpg"

// import kerybg from "./img/kery-bg3.png"
// import bandDef1 from "./img/band-def-1.jpg"
// import bandDef2 from "./img/band-def-2.jpg"
// import bandDef3 from "./img/band-def-3.jpg"
// import bandDef4 from "./img/band-def-4.jpg"



// import firebase from "firebase";
// import "firebase/analytics";
// import "firebase/auth";
// import "firebase/firestore";


// var firebaseConfig = {
//     apiKey: "AIzaSyCbgQ5cyKWBGhFmWQs1X0kxwXYJSkwSZ-M",
//     authDomain: "vinyl-fr.firebaseapp.com",
//     projectId: "vinyl-fr",
//     storageBucket: "vinyl-fr.appspot.com",
//     messagingSenderId: "843166347567",
//     appId: "1:843166347567:web:f4a63c6dc1ae2653e3f1da",
//     measurementId: "G-9MTBLLWT9J"
//   };
  
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();


const App = () => {

    const [loaded, setLoaded] = useState(false);

    //SearchBar
    const [req, setReq] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchInput = useRef(null);

    const [smIsOpen, setSmIsOpen] = useState(false);

    //Auth
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    const [userData, setUserData] = useState(null);

    const ProviderValue = useMemo(() => (userData), [userData])

    //Scroll behavior
    const [scrolled, setScrolled] = useState(false);


    let navbarClasses=['navbar'];
    scrolled && navbarClasses.push('scrolled');

    
    const [eventsList, setEventsList] = useState([]);

    const [eventsList2, setEventsList2] = useState([
        // {
        //     address: "Salle Jacques Brel, Paris",
        //     artist: "Kery James",
        //     capacity: "1500",
        //     createdAt: "Monday, Apr 26, 2021, 2:18 AM",
        //     eventDate: "Jeudi 12 Mars 2020",
        //     id: "event52709848489945976",
        //     name: "Le mélancolique tour",
        //     photoBg: "https://cdn.discordapp.com/attachments/836327525520769088/836327903117049926/Keryjames.png",
        //     photoMin: "https://images.squarespace-cdn.com/content/v1/59636566e3df28d47c419149/1609820912809-16Z22W1GVNTHQV09GJJT/ke17ZwdGBToddI8pDm48kHhlTY0to_qtyxq77jLiHTtZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7Xj1nVWs2aaTtWBneO2WM-sIRozzR0FWTsIsFVspibqsB7eL2qd43SOgdOvkAOY75w/event.jpg",
        //     subDescription: "Cet artiste intarissable allie les mots enragés avec un engagement sincère. Et il n'a pas fini de bousculer la scène urbaine ni de boxer avec toutes les subtilités de la langue française.",
        //     subTitle: "Kery James revisite son répertoire dans un concert acoustique.",
        // },
        // {
        //     address: "Brasil",
        //     artist: "Ronaldinho",
        //     capacity :"13000",
        //     createdAt: "Wednesday, Apr 28, 2021, 6:30 PM",
        //     eventDate: "18 Septembre 2022",
        //     id :"e356782046629752300",
        //     name :"Eventao do Brasil #1839 Party",
        //     photoBg: "https://www.wallpapertip.com/wmimgs/2-27163_4k-football-wallpapers-futbol-wallpaper-hd-4k.jpg",
        //     photoMin: "https://cdn-sports.konbini.com/images/files/2015/04/Ronaldinho_48_4_.v1417611739-e1486116553599.jpg",
        //     subDescription: "Les images peuvent être soumises à des droits d'auteur. Les images peuvent être soumises à des droits d'auteur.",
        //     subTitle: "Les images peuvent être soumises à des droits d'auteur" ,
        // },
        // {
        //     address: "Vélodrome, Marseille",
        //     artist: "IAM",
        //     capacity :"16000",
        //     createdAt: "Monday, Apr 26, 2021, 2:25 AM",
        //     eventDate :"Mercredi 10 Juin 1954",
        //     id :"event75548265079028800",
        //     name: "Funk house #1838",
        //     photoBg: "https://cdn.discordapp.com/attachments/836327525520769088/836328863101222992/iam-2004sipa.jpg",
        //     photoMin :"https://www.excellsecurity.com.au/wp-content/uploads/2017/10/3-Tips-for-Effective-Crowd-Control.jpg",
        //     subDescription: `L'album d'IAM L'école du micro d'argent fête ses 20 ans. Disque d'or en 24h, deux Victoires de la musique : avec ses hymnes "Nés sous la même étoile", "L'Empire du côté obscur" et surtout Demain, cest loin, cest le chef d'oeuvre d'n groupe à son apogée. IAM le rejoue actuellement en tournée dans toute la France. L'occasion de revenir sur certains recoins méconnus de cette pépite. `,
        //     subTitle: "IAM présente un nouvel album." ,
        // }
    ]);
    

    const handleScroll=() => {
        const offset=window.scrollY;
        offset > 250 ? setScrolled(true) : setScrolled(false);
    }







    useEffect(() => {
        //Events database
    
        // setTimeout(()=>{
        // }, 750)




        //Eventslist

        const Efv = firebase.firestore().collection('event');
        Efv.get().then(eventDoc => {
            eventDoc.docs.map((snapshot) => 
                eventsList.push(snapshot.data())
            )
            setLoaded(true)
        }).catch(error => {
            console.log(error)
        })

        // //Userdata

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.firestore().collection('user')
                .doc(firebase.auth().currentUser.uid).get()
                .then((userData) => {
                    console.log(userData.data())
                    setUserData(userData.data());
                    setIsLoggedIn(true)
                }).catch(error=>{
                    alert(error)
                })
            } else {
                setIsLoggedIn(false)
            }
        });
        
        }, [eventsList]
    )



    // SEARCH BAR
    const handleChange = (e) => {
        e.preventDefault()

        setReq(e.target.value)
        
        

        let lowercasedFilter = req.toLowerCase();
        const filteredData = eventsList.filter(item => {
            return e.target.value.length > 2 && Object.keys(item).some(key =>
                item[key].toLowerCase().includes(lowercasedFilter)
                );
            });
        setShowSearchResults(true)
        setFilteredEvents(filteredData)
    }

    const handleSearchFormSubmit = (e) => {
        e.preventDefault()
        setShowSearchResults(!showSearchResults)
        console.log(e.key)
    }



    const handleNavLogo = () => {
        searchInput.current.value = "";
        setReq('')

    }

    //Scroll behavior
    // document.querySelector('.navbar') &&
    // setOffsetTop(document.querySelector('.navbar').offsetTop);

    window.addEventListener('scroll',handleScroll)






    //LOGIN
    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const email = event.target[0].value;
            const password = event.target[1].value;
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password)
                alert('Logged in successfully');
                // setIsLoggedIn(true)
            }
            catch (error){
                        alert(error)
                    }
                }, []
            )

    const handleSignUp = useCallback(
        async event => {
            event.preventDefault();

            // const userID = "user" + Date.now() * Math.floor(Math.random() * 1000)* Math.floor(Math.random() * 1000)

            let date = new Date();  
            let options = {  
                weekday: "long", year: "numeric", month: "short",  
                day: "numeric", hour: "2-digit", minute: "2-digit"  
            };  

            const email = event.target[0].value;
            const password = event.target[1].value;


            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid)
                .set({
                    id: firebase.auth().currentUser.uid,
                    email: firebase.auth().currentUser.email,
                    createdAt: date.toLocaleTimeString("en-us", options),
                    role: "user",
                }).catch(error => {
                    console.log(error)
                })
            }).catch(error => {
                console.log(error)
            })

        //     try {
        //         await firebase.auth().createUserWithEmailAndPassword(email, password);
                
        //         // firestore.collection('Users').doc(event.target.uid).set(event.target.uid)

        //         firebase.firestore().collection('user').doc()
        //         .set({
        //             email: email,
        //             id: firebase.auth().currentUser.uid,
        //    //             id: userID,
        //             createdAt: date.toLocaleTimeString("en-us", options),
        //             role: "user",
        //         }).catch(error => {
        //             console.log(error)
        //         }).then((Xfe) => {
        //             alert(`Utilisateur "${email}" ajouté correctement`);
        //         })

        //     }
        //     catch(error){
        //         alert(error)
        //     }




        }, []
    )

    const handleLogout = useCallback(() => {
        firebase.auth().signOut();
        setIsLoggedIn(false);
        alert('Signed out from firebase');
    }, [])







    const Home = () => {

        const Header = () => {
            return(
                <div className="header-img">
                    <img className="header-img-logo" src={logo1} alt="logo-1" />
                    <h3 className="header-title">VINYL</h3>
                    <h2>Le site 100% musique</h2>
                    <p>S'informer, découvrir, réserver</p>
                </div>
            )
        }

        return (
            <>
                <section className="header">
                    <Header/>
                    {/* <SearchResults request={req} results={filteredEvents} /> */}
                </section>
                <section className="main">
                    <div>
                        <h3 className="main-title">LES DERNIERS CONCERTS AJOUTÉS</h3>
                    </div>
                    <div className="events-home">
                        {
                            eventsList.length>0 ?
                            eventsList.map((event, index) => {
                                return(
                                    <div className="event-box" key={index}>
                                        <NavLink onClick={()=>{setShowSearchResults(false)}}
                                            to={{
                                                pathname: "/event/" + event.id,
                                                state: {event: event}
                                            }}>
                                            <img  className="event-box-img" src={event.photoMin} alt="event default" />
                                            <h3>{event.artist}</h3>
                                            <h5>{event.address}</h5>
                                        </NavLink>
                                    </div>
                                )
                            }) : 'rien'
                        }
                    </div>
                </section>
            </>

        )
    }







    return (
        <>
        {
            !loaded ? <Loader /> :

            <BrowserRouter><UserContext.Provider value={ProviderValue}>
            {
                !isLoggedIn ? (
                    <section className="auth">

                        <div className="header-auth header-img-logo-auth">
                            <div className="authContainer">
                                <div className="authT">
                                    <img className="" src={logo1} alt="logo-1" />
                                </div>

                                <div className="authM">
                                    <h2>Bienvenue sur Vinyl</h2>
                                    <p>The ultimate music & live 16 admin site for next generation web apps live 16 admin site for next generation.</p>
                                </div>
                            </div>

                            <div className="authB">
                                <h6>© 2021 Vinyl</h6>
                                <div>
                                    <h6>Privacy</h6>
                                    <h6>Legal</h6>
                                    <h6>Contact</h6>
                                </div>
                            </div>
                        </div>

                        
                        <div className="login">

                            <div className="auth-loginT">
                                <p>Vous n'avez pas encore de compte ? &nbsp;</p>
                                <a onClick={(e)=>{e.preventDefault() ;setCreateAccount(true)}} href="/"> S'inscrire</a>
                            </div>
                            {
                        !createAccount ?(
                            <>
                            <form onSubmit={handleLogin} className="loginForm">
                                <h2>Se connecter</h2>
                                <p>Entrez votre nom d'utilisateur et votre mot de passe</p>
                                <input type="text" onChange={()=>{}} placeholder="Username" />
                                <input type="password" onChange={()=>{}} placeholder="Password" />
                                <div className="login-buttons">
                                    <a href="/">Mot de passe oublié</a>
                                    <button type="submit">Se connecter</button>
                                </div>
                            </form>
                            <span />
                            
                            </>
                            )
                        :
                        <form onSubmit={handleSignUp} className="loginForm">
                            <h2>Créer un compte</h2>
                            <p>Entrez votre adresse email et choisissez un mot de passe</p>
                            <input type="email" onChange={()=>{}} placeholder="Adresse email" />
                            <input type="password" onChange={()=>{}} placeholder="Password" />
                            <div className="login-buttons">
                                <a href="/">Mot de passe oublié</a>
                                <button style={{backgroundColor: "transparent", color: "var(--orangeDefault)", border: "solid var(--orangeDefault) 2px"}} onClick={()=>{setCreateAccount(false)}}>Annuler</button>
                                <button type="submit">Créer mon compte</button>
                            </div>
                        </form>  
                        
                    }
                    </div>
                </section>
                ) :
                
                <div className="mc1">
                    {
                        showSearchResults && <span style={{backgroundColor:"rgba(0, 0, 0, 0.85)", position: "absolute" ,height: '100vh', width:'100vw'}}
                        onClick={()=>{
                            setShowSearchResults(!showSearchResults);
                        }} />
                    }
                    {
                        smIsOpen && <span style={{backgroundColor:"rgba(0, 0, 0, 0.85)", position: "absolute" ,height: '100vh', width:'100vw'}}
                        onClick={()=>{
                            setSmIsOpen(!smIsOpen);
                        }} />
                    }
                    {/* <div className="navbar"> */}
                    <div className={navbarClasses.join(" ")}>

                        <div className="nav-left">
                            <a href="/">
                                <img className="navbar-logo-1" src={logo1} alt="vinyl-logo" />
                            </a>
                            <div className="search-bar-container">
                                
                                <form onSubmit={(e)=>{handleSearchFormSubmit(e)}} onKeyPress={(e)=>{e.key === 'Enter' && setShowSearchResults(false)}} onChange={(e)=>{handleChange(e)}} className="search-form-navbar">
                                    <input ref={searchInput} onChange={(e)=>{handleChange(e)}} className="nav-search" type="search" placeholder="Rechercher ..."/>
                                    <NavLink to={{
                                        pathname: "/search/" + req,
                                        state: {results: filteredEvents, request: req, }
                                    }}>
                                        <input value="" className="navbar-search-submit" type="submit" style={{backgroundImage: `url(${loupe})`}} alt="search-icon" />
                                    </NavLink>
                                </form>
                                {
                                    showSearchResults &&
                                    <div onClick={()=>{
                                        setTimeout(()=>{
                                            setShowSearchResults(false);
                                        }, 300)
                                    }} className="search-bar-results">
                                        <ul className="sbr1">
                                        {   
                                            filteredEvents.map((event, index) => {
                                                return (
                                                    <NavLink key={index} to={{
                                                        pathname: `/event/${event.id}`,
                                                        state: {event: event}
                                                    }}>
                                                        <li className="sbr1Li">
                                                            <div className="sbr1liL">
                                                                <img className="sbr1Img" src={event.photoMin} alt={event.name} />
                                                                <h3 className="sbr1Name">{event.name}</h3>
                                                            </div>
                                                            <div className="sbr1liR">
                                                                <p className="sbr1Date">{event.eventDate}</p>
                                                            </div>
                                                        </li>
                                                    </NavLink>
                                                )
                                            })
                                        }

                                        <NavLink className="sbr1AllResults" to={{
                                            pathname: "/search/" + req,
                                            state: {results: filteredEvents, request: req, }
                                        }}>
                                            <p>Voir tous les résultats</p>
                                        </NavLink>
                                        </ul>
                                    </div>
                                }

                            </div>
                        </div>

                        <div className="nav-actions">
                            <a onClick={(e)=>{e.preventDefault(); handleLogout()}} href="/">SE DÉCONNECTER</a>
                            <NavLink to={{pathname: "/newevent"}}>ADD EVENT</NavLink>
                            <div className="menu1-logo" onClick={()=>setSmIsOpen(!smIsOpen)}>
                                {/* <img src={menu1} className="menu1-logo" alt="menu1" /> */}
                                {
                                    !smIsOpen ? <GiHamburgerMenu/> : <CgClose />
                                }
                            </div>
                        </div>

                    </div>

                    <div className={`sidebar ${smIsOpen ? "smOpen" : "smClose"}`}>
                        <div className="sb1user">
                            {
                                userData ? <h3>Connecté en tant que {userData.email}</h3> : 'Offline'
                            }
                        </div>
                    </div>

                </div>


            }

                <Route render={({location}) => (
                    <TransitionGroup>
                        <CSSTransition
                            key={location.key}
                            timeout={300}
                            classNames="fade"
                        >
                            <Switch location={location}>
                                <Route exact path="/" component={Home} />
                                <Route path="/event/:id" component={ViewEvent} />
                                <Route path="/search/:request" component={SearchResults} />
                                
                                
                                <Route path="/newevent" component={NewEvent} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                )} />

                
            </UserContext.Provider></BrowserRouter>
        }
        </>
    )
}

export default App;