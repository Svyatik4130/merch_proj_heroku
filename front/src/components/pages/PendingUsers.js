import Axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'


export default function PendingUsers() {
    const allUsers = useSelector(state => state.allUsers)
    const [isLoaded, setIsLoaded] = useState(false);
    const [htmlAllPendingUsers, sethtmlAllPendingUsers] = useState()

    useEffect(() => {
        sethtmlAllPendingUsers({
            html: allUsers.filter(user => user.pending === true)
        })

        setIsLoaded(true);
    }, [])


    const acceptRegistration = async (userId) => {
        let token = localStorage.getItem("auth-token")
        const replaceUser = await axios.post("/users/acceptuser", { userId }, { headers: { "x-auth-token": token } })
        console.log(replaceUser)
        UsersRerender(userId)
    }
    const rejectRegistration = async (userID) => {
        let token = localStorage.getItem("auth-token")
        const replaceUser = await axios.post("/users/deleteUser", { userID }, { headers: { "x-auth-token": token } })
        console.log(replaceUser)
        UsersRerender(userID)
    }

    const UsersRerender = (userId) => {
        const index = htmlAllPendingUsers.html.findIndex((user) => { return user._id === userId })
        if (index > -1) {
            const newArr = htmlAllPendingUsers
            newArr.html.splice(index, 1)
            sethtmlAllPendingUsers({
                html: newArr.html
            })
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
            <div>
                <h2>Waiting users for registration confirmation</h2>
                {htmlAllPendingUsers.html.length > 0 ? (htmlAllPendingUsers.html.map((user) => {
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
                })) : (null)}
            </div>
        )
    }
}
