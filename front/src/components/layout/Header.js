import React from 'react'
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { loggedUser } from '../../actions/UserActions'
import { pushAddress } from '../../actions/locationActions'
import { getAllUsers } from '../../actions/UserActions'


export default function Header() {

    // const { userData, setUserData } = useContext(UserContext)
    const userData = useSelector(state => state.userData)
    const dispatch = useDispatch()

    const history = useHistory()

    const register = () => { history.push("/register") }
    const login = () => { history.push("/login") }
    const myAcc = () => { history.push("/profile") }
    const logout = () => {
        dispatch(loggedUser({
            token: undefined,
            user: undefined
        }))
        dispatch(pushAddress([]))
        dispatch(getAllUsers([]))
        localStorage.setItem("auth-token", "")
    }

    return (
        <nav className="navbar navbar-inverse navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="navbar-header">
                    <Link className="navbar-brand" to={"/"}>Merch<span role='img' aria-label="Close">🌐</span></Link>
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
                        <li className="nav-item"><button onClick={myAcc}>Profile</button></li>
                    </ul>
                ) : (null)}
            </div>
        </nav>
    )
}


