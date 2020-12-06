import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { addAddress } from '../../actions/locationActions'

import AdminPanel from '../layout/AdminPanel'
import SeeAllLocationsForAdmins from './SeeAllLocationsForAdmins'
import SeeReportsForAdmin from "./SeeReportsForAdmin";
import UserPanel from '../layout/UserPanel'
import SetLoactionForUser from "./SetLoactionForUser";
import PendingUsers from "./PendingUsers";

export default function HomeAdmin() {
    const url = window.location.href
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userData)
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false)
    const [classNameForMenuBtn, setclassNameForMenuBtn] = useState({
        location: "",
        users: ""
    })
    const [userInfo, setuserInfo] = useState()
    const [addAddressAnim, setaddAddressAnim] = useState({
        class: "collapsed",
        buttonHolder: "Add new Location",
        error: null
    })
    const [addAddressAnim_inputValue, setaddAddressAnim_inputValue] = useState({
        value: '',
        status: '',
        statusClassname: 'address-form-status',
    })
    const allAddresses = useSelector(state => state.allAddresses)

    useEffect(() => {
        if (!userData.user) history.push('/login')
        if(userData.user.role !== 1) history.push("/main")
        const getUser = async () => {
            let token = localStorage.getItem("auth-token")
            const { data } = await axios.get("/users/", { headers: { "x-auth-token": token } })
            console.log(data)
            setuserInfo(data)
            setIsLoaded(true);

            if(url.slice(-4) == "main"){
                history.push("/main/admin/users")
            }
        }

        if (url.match("/main/admin/locations")) {
            setclassNameForMenuBtn({
                location: "menu-active",
                users: ""
            })
        } else {
            setclassNameForMenuBtn({
                location: "",
                users: "menu-active"
            })
        }
        getUser()
    }, [])

    const setNewActive = (active_menu) => {
        switch (active_menu) {
            case "locations":
                setclassNameForMenuBtn({
                    location: "menu-active",
                    users: ""
                })
                break;
            case "users":
                setclassNameForMenuBtn({
                    location: "",
                    users: "menu-active"
                })
                break;

            default:
                history.push("/main")
                setclassNameForMenuBtn({
                    location: "",
                    users: "menu-active"
                })
                break;
        }
    }

    function collapse() {
        setaddAddressAnim({ class: "collapsed", buttonHolder: "Add one more Location" })
    }
    async function submitAddress(e) {
        e.preventDefault()

        try {
            let token = localStorage.getItem("auth-token")

            const addLocation = await axios.post("/locations/add", addAddressAnim_inputValue, { headers: { "x-auth-token": token } })
            if (addLocation.statusText === "OK") {
                setaddAddressAnim_inputValue({ value: '', status: "New address has been successfully added", statusClassname: "address-form-status-ok" })
            }
            console.log(addLocation)
            dispatch(addAddress(addLocation.data))
            collapse()
        } catch (error) {
            console.log(error.response.data.msg)
            console.log(error.message)
            setaddAddressAnim_inputValue({ value: '', status: error.response.data.msg, statusClassname: "address-form-status-err" })
        }
    }
    function expand(event) {
        setaddAddressAnim({ class: "expanded", buttonHolder: "Add new Location" })
        var textInput = event.target.closest("#slider").children[1]
        setTimeout(() => {
            textInput.focus()
        }, 500);
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
                                {/* { url.match("/main/admin/locations") ? (<h1>yes</h1>) : (<h2>No</h2>)} */}
                                <div className="sidebar-menu">
                                    <Link to={"/main/admin/users"}><button onClick={() => { setNewActive("users") }} className={`sidebar-menu-button ${classNameForMenuBtn.users}`}>Users</button></Link>
                                    {url.match("/main/admin/users") ? (<button onClick={() => {history.push("/main/admin/users/pending")}} className="admin-panel-pending-users"> Pending users </button>) : (null)}

                                    <Link to={"/main/admin/locations"}><button onClick={() => { history.push("/main/admin/locations"); setNewActive("locations") }} className={`sidebar-menu-button ${classNameForMenuBtn.location}`}>Locations</button></Link>
                                    {url.match("/main/admin/locations") ? (<>
                                        <form id='buttonWithText' onSubmit={submitAddress}>
                                            <div id='slider' className={addAddressAnim.class}>
                                                <button type="button" onClick={expand} className="add-loc-button" id='toggle'>{addAddressAnim.buttonHolder}</button>
                                                <input type='text' id='address-input' placeholder='New location name' size="8" value={addAddressAnim_inputValue.value} onChange={e => setaddAddressAnim_inputValue({ value: e.target.value })} />
                                                <input type='submit' id='ok' value='Submit' />
                                            </div>
                                        </form>
                                        <div className="all-loacations-admin">
                                            <p className={addAddressAnim_inputValue.statusClassname} >{addAddressAnim_inputValue.status}</p>
                                        </div>
                                    </>) : (null)}

                                </div>
                            </div>
                            <div className="content">
                                <Switch>
                                    <Route exact path="/main/admin/locations" component={SeeAllLocationsForAdmins} />
                                    <Route exact path="/main/admin/locations/reports/:id" component={SeeReportsForAdmin} />
                                    <Route exact path="/main/admin/users/setlocation/:id" children={<SetLoactionForUser />} />
                                    <Route exact path="/main/admin/users/pending" component={PendingUsers} />
                                    <Route exact path="/main/admin/users">
                                        {userData.user ? (userData.user.role === 1 ? (<AdminPanel />) : (<UserPanel />)) : (null)}
                                    </Route>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
