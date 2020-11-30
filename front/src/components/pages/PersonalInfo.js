import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader";

export default function PersonalInfo() {
    const userData = useSelector(state => state.userData)
    const [isLoaded, setIsLoaded] = useState(false);
    const [userInfo, setuserInfo] = useState()
    const history = useHistory();
    useEffect(() => {
        console.log("1")
        if (!userData.user) history.push('/login')
        const getUser = async () => {
            let token = localStorage.getItem("auth-token")
            const { data } = await axios.get("/users/", { headers: { "x-auth-token": token } })
            console.log(data)
            setuserInfo(data)
            setIsLoaded(true);
        }
        getUser()
        console.log(userInfo)
    }, [])
    if (!isLoaded) {
        return (
            <div className="container">
                <div className="preloader">
                    <PulseLoader size={60} color={"#fff"} loading={!isLoaded} />
                </div>
            </div>
        )
    } else {
        return (
            <div className="App">
                <div className="auth-wrapper">
                    <div className="auth-inner-home">
                        <div className="profile-section">
                            <p className="profile-heading"><strong>Your name:</strong></p>
                            <p className="profile-value"><strong>{userInfo.displayName}</strong></p>
                        </div>
                        <div className="profile-section">
                            <p className="profile-heading">Your Address:</p>
                            <p className="profile-value">{userInfo.address}</p>
                        </div>
                        <div className="profile-section">
                            <p className="profile-heading">Your email:</p>
                            <p className="profile-value">{userInfo.email}</p>
                        </div>
                        <div className="profile-section">
                            <p className="profile-heading">Your phone:</p>
                            <p className="profile-value">{userInfo.phone}</p>
                        </div>
                        <div className="profile-section">
                            <p className="profile-heading">Your role:</p>
                            <p className="profile-value">{userInfo.roleId === 0 ? ("User") : ("Admin")}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
