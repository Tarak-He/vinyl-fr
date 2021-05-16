import React from 'react';
import logo1 from "../img/logo-1.png"

const Loader = () => {



    return (
        <div className="loader">
            <div className="authT">
                <img className="" src={logo1} alt="logo-1" />
            </div>
            <div className="loader-animation">
                <div/>
                <div/>
                <div/>
            </div>
        </div>
    )
}

export default Loader;