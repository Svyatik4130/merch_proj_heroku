import Axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'
import { deleteUserRedux } from '../../actions/UserActions'
import { deletePendingUserRedux } from '../../actions/UserActions'
import { getAllUsers } from "../../actions/UserActions";

import EmptyPage from '../misc/EmptyPage'


export default function PendingUsers() {
    const dispatch = useDispatch()
    const allUsers = useSelector(state => state.allUsers)
    const pendingUsers = useSelector(state => state.pendingUsers)
    const [isLoaded, setIsLoaded] = useState(false);
    const [htmlAllPendingUsers, sethtmlAllPendingUsers] = useState()

    useEffect(() => {
        sethtmlAllPendingUsers({
            html: pendingUsers
        })

        setIsLoaded(true)
    }, [])


    const acceptRegistration = async (userId) => {
        let token = localStorage.getItem("auth-token")
        const replaceUser = await axios.post("/users/acceptuser", { userId }, { headers: { "x-auth-token": token } })
        console.log(replaceUser)
        const index = htmlAllPendingUsers.html.findIndex((user) => { return user._id === userId })

        allUsers.push(pendingUsers.find(pndUser => pndUser._id === userId))
        dispatch(getAllUsers(allUsers))
        dispatch(deletePendingUserRedux(index))

        sethtmlAllPendingUsers({
            html: pendingUsers
        })
    }
    const rejectRegistration = async (userID) => {
        let token = localStorage.getItem("auth-token")
        const replaceUser = await axios.post("/users/deleteUser", { userID }, { headers: { "x-auth-token": token } })
        console.log(replaceUser)
        const index = htmlAllPendingUsers.html.findIndex((user) => { return user._id === userID })

        dispatch(deletePendingUserRedux(index))

        sethtmlAllPendingUsers({
            html: pendingUsers
        })
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
            <div>
                {htmlAllPendingUsers.html.length > 0 ? (
                    <>
                    <h2>Waiting users for registration confirmation</h2>

                    {htmlAllPendingUsers.html.map((user) => {
                        return (
                            <div key={user._id} className="admin-panel-user-container">
                                <div className="inner-admin-panel-user-container-container">
                                    <div className="admin-panel-user-container-container">
                                        <p className="admin-panel-userName">{user.displayName}</p>
                                        <p className="admin-panel-email">{user.email}</p>
                                    </div>
                                </div>
                                <div className="Admin-pending-users-options">
                                    <button onClick={() => acceptRegistration(user._id)} className="Admin-pending-users-options-accept" >Accept</button>
                                    <button onClick={() => rejectRegistration(user._id)} className="Admin-pending-users-options-reject" >Reject</button>
                                </div>
                            </div>
                        )
                    })}
                    </>
                ) : (<EmptyPage text={"No pending users yet"} />)}
            </div>
        )
    }
}
