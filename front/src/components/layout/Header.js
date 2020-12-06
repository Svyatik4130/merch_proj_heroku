import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { loggedUser } from '../../actions/UserActions'
import { pushAddress } from '../../actions/locationActions'
import { getAllUsers } from '../../actions/UserActions'
import { sendAllReportsAdmin } from '../../actions/sendAllreports-Admin'
import { getAllPendingUsers } from '../../actions/UserActions'



export default function Header() {
    const userData = useSelector(state => state.userData)
    const dispatch = useDispatch()

    const history = useHistory()

    const register = () => { history.push("/register") }
    const login = () => { history.push("/login") }
    const myAcc = () => { history.push("/profile") }
    const logout = () => {
        history.push("/login")
        dispatch(loggedUser({
            token: undefined,
            user: undefined
        }))
        dispatch(pushAddress([]))
        dispatch(getAllUsers([]))
        dispatch(sendAllReportsAdmin([]))
        dispatch(getAllPendingUsers([]))
        localStorage.setItem("auth-token", "")
    }

    const setHomeRoute = () => {
        if (userData){
            if(userData.user){
                if (userData.user.role === 1){
                    return "/main/admin/users"
                } else {
                    return "/main/user/locations"
                }
            }
        }
    }


    return (
        <nav className="navbar navbar-inverse navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="navbar-header">
                    <Link className="navbar-brand" to={setHomeRoute()}>Merch<span role='img' aria-label="Close">🌐</span></Link>
                    {userData.user ? (
                        <button onClick={logout}>Log out</button>
                    ) : (
                            <>
                                <button className="auth-button" onClick={register}>Register</button>
                                <button className="auth-button" onClick={login}>Login</button>
                            </>
                        )}
                </div>
                {userData.user ? (
                    <ul className="nav navbar-nav navbar-left">
                    </ul>
                ) : (null)}
            </div>
        </nav>
    )
}
