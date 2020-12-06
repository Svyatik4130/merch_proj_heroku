import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { addAddress } from '../../actions/locationActions'

import AddReport from './AddReport'
import ExactLocationsForUser from '../layout/ExactLocationsForUser'
import IsPending from '../layout/IsPending'
import RecentUserReports from '../pages/RecentUserReports'

export default function HomeAdmin() {
    const url = window.location.href
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userData)
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false)
    const [classNameForMenuBtn, setclassNameForMenuBtn] = useState({
        locations: "",
        recentReports: ""
    })
    const [userInfo, setuserInfo] = useState()

    useEffect(() => {
        if (!userData.user) history.push('/login')
        const getUser = async () => {
            let token = localStorage.getItem("auth-token")
            const { data } = await axios.get("/users/", { headers: { "x-auth-token": token } })
            console.log(data)
            if (data.pending) history.push("/main/user/pending")
            setuserInfo(data)
            setIsLoaded(true)

            if (url.slice(-4) == "main") {
                history.push("/main/user/locations")
            }
        }

        // if (url.match("/main/admin/locations")) {
        //     setclassNameForMenuBtn({
        //         location: "menu-active",
        //         users: ""
        //     })
        // } else {
        //     setclassNameForMenuBtn({
        //         location: "",
        //         users: "menu-active"
        //     })
        // }
        if (url.match("/main/user/locations")) {
            setclassNameForMenuBtn({
                locations: "menu-active",
                recentReports: ""
            })
        } else if (url.match("/main/user/recent-reports")) {
            setclassNameForMenuBtn({
                locations: "",
                recentReports: "menu-active"
            })
        } else {
            setclassNameForMenuBtn({
                locations: "menu-active",
                recentReports: ""
            })
        }
        getUser()
    }, [])

    const setNewActive = (active_menu) => {
        switch (active_menu) {
            case "locations":
                setclassNameForMenuBtn({
                    locations: "menu-active",
                    recentReports: ""
                })
                break;
            case "users":
                setclassNameForMenuBtn({
                    locations: "",
                    recentReports: "menu-active"
                })
                break;

            default:
                history.push("/main/user/locations")
                setclassNameForMenuBtn({
                    locations: "",
                    recentReports: "menu-active"
                })
                break;
        }
    }

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
                        <div className="home-page-container">
                            <div className="home-page-container-profile">
                                <div className="profile-section">
                                    <p className="name profile-value"><strong>{userInfo.displayName}</strong></p>
                                </div>
                                <div className="profile-section">
                                    <p className="role profile-value">Role: {userInfo.role === 0 ? ("User") : ("Admin")}</p>
                                </div>
                                <div className="profile-section">
                                    <p className="profile-heading">Address 📍 :</p>
                                    <p className="profile-value">{userInfo.address}</p>
                                </div>
                                <div className="profile-section">
                                    <p className="profile-heading">Email 📧 :</p>
                                    <p className="profile-value">{userInfo.email}</p>
                                </div>
                                <div className="profile-section">
                                    <p className="profile-heading">Phone ☎️ :</p>
                                    <p className="profile-value">{userInfo.phone}</p>
                                </div>
                                <div className="sidebar-menu">
                                    {userData.user.pending ? (null) : (
                                        <>
                                            <Link to={"/main/user/locations"}><button onClick={() => { setNewActive("locations") }} className={`sidebar-menu-button ${classNameForMenuBtn.locations}`}>My Locations</button></Link>
                                            <Link to={"/main/user/recent-reports"}><button onClick={() => { setNewActive("recent-reports") }} className={`sidebar-menu-button ${classNameForMenuBtn.recentReports}`}>My recent reports</button></Link>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="content">
                                <Switch>
                                    <Route exact path="/main/user/locations" component={ExactLocationsForUser} />
                                    <Route exact path="/main/user/makereport/:id" children={<AddReport />} />
                                    <Route exact path="/main/user/pending" children={<IsPending />} />
                                    <Route exact path="/main/user/recent-reports" children={<RecentUserReports />} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
