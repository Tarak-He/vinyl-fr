import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"

import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

//Components
import Loader from "./Components/Loader";
import NewEvent from "./Components/NewEvent";
import SearchResults from "./Components/SearchResults";
import ViewEvent from "./Components/ViewEvent";
import Bookmarks from "./Components/Bookmarks";

//Firebase
import firebase from "./Config/Firebase";
import UserContext from './User/UserContext';

//Icons
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgClose } from "react-icons/cg";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { BsBookmarkFill } from "react-icons/bs";
import logo1 from "./img/logo-1.png"
import loupe from "./img/glass.svg"
import Profile from "./Components/Profile";


const App = () => {

    const [eventsList, setEventsList] = useState([]);
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

    
    

    const handleScroll=() => {
        const offset=window.scrollY;
        offset > 250 ? setScrolled(true) : setScrolled(false);
    }


    useEffect(() => {
        // setTimeout(()=>{

        // }, 750)


            //Récupération de Eventslist from firestore
            const Efv = firebase.firestore().collection('event');
            Efv.get().then(eventDoc => {
                eventDoc.docs.map((snapshot) => 
                    eventsList.push(snapshot.data())
                )

                //Loader qui conditionne le chargement de la page
                setLoaded(true)
            }).catch(error => {
                alert(error)
            })

            //Récupération de Userdata from firestore Auth (listener)
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    firebase.firestore().collection('user')
                    .doc(firebase.auth().currentUser.uid).get()
                    .then((userData) => {
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

        //Requête
        setReq(e.target.value)
        let lowercasedFilter = req.toLowerCase();

        //On filtre les events pour ne récupérer que ceux qui sont demandés
        const filteredData = eventsList.filter(item => {
            return e.target.value.length > 2 && Object.keys(item).some(key =>
                item[key].toLowerCase().includes(lowercasedFilter)
                );
            });

        //Loader pour l'apparition des résultats
        setShowSearchResults(true)

        //Stocker les events filtrés dans filteredEvents
        setFilteredEvents(filteredData)
    }

    const handleSearchFormSubmit = (e) => {
        e.preventDefault()
        //Pour que le menu se ferme onKeyPress enter
        setShowSearchResults(!showSearchResults)
    }

    //Scroll behavior
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
                    bookmarks: [],
                }).catch(error => {
                    alert(error)
                })
            }).catch(error => {
                alert(error)
            })
        }, []
    )

    const handleLogout = useCallback(() => {
        firebase.auth().signOut();
        setIsLoggedIn(false);
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

        return isLoggedIn && (
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
                            {
                                userData.role === "admin" && <NavLink to={{pathname: "/newevent"}}>ADD EVENT</NavLink>
                            }

                            <div className="menu1-logo" onClick={()=>setSmIsOpen(!smIsOpen)}>
                                {/* <img src={menu1} className="menu1-logo" alt="menu1" /> */}
                                {
                                    !smIsOpen ? <GiHamburgerMenu/> : <CgClose />
                                }
                            </div>
                        </div>

                    </div>

                    <div className={`sidebar ${smIsOpen ? "smOpen" : "smClose"}`}>
                        <div>
                            <div className="sb1user">
                                {
                                    !userData ? 'Offline' : 
                                        <h4>
                                            <span>{userData.email}</span>
                                        </h4>
                                }
                            </div>

                            <div className="sidebar-items-container" onClick={()=>{setSmIsOpen(false)}}>
                                <NavLink to={{
                                        pathname: "/profile",
                                        state: userData,
                                }}>
                                    <FaUserCircle />
                                    PROFILE
                                </NavLink>
                                <NavLink to={{
                                    pathname: "/bookmarks",
                                    // bookmarks: userData.bookmarks,
                                }}>
                                    <BsBookmarkFill />
                                    BOOKMARKS
                                </NavLink>
                                
                            </div>
                        </div>
                        

                        <div className="sb1sm">
                            <SiFacebook />
                            <SiInstagram />
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
                                <Route path="/bookmarks" component={Bookmarks} />
                                
                                <Route path="/profile" component={Profile} />
                                
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