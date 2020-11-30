import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import axios from 'axios'
import ErrorNotice from '../misc/ErrorNotice'
import { loggedUser } from '../../actions/UserActions'
import { useDispatch } from 'react-redux'
import { pushAddress } from '../../actions/locationActions'


export default function Register() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordCheck, setPasswordCheck] = useState()
    const [displayName, setDisplayName] = useState()
    const [phone, setPhone] = useState()
    const [address, setAddress] = useState()
    const [error, setError] = useState()

    const dispatch = useDispatch()
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault()
        try {
            const newUser = { email, password, passwordCheck, displayName, phone, address }
            await axios.post("/users/register", newUser)

            const loginRes = await axios.post("users/login", { email, password })
            dispatch(loggedUser({
                token: loginRes.data.token,
                user: loginRes.data.user
            }))

            const allLocations = await axios.get("/locations/alllocations")
            dispatch(pushAddress(allLocations.data))

            localStorage.setItem("auth-token", loginRes.data.token)
            history.push('/main')
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }

    }

    return (
        <div className="App">
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={submit}>
                        <h3>Sign Up</h3>
                        {error && <ErrorNotice message={error} clearError={() => { setError(undefined) }} />}

                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="name" className="form-control" placeholder="First name" onChange={e => setDisplayName(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" name="email" className="form-control" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" name="address" className="form-control" placeholder="Enter address" onChange={e => setAddress(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Phone number</label>
                            <input type="tel" name="phone" className="form-control" placeholder="Enter your phone number" onChange={e => setPhone(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="pass" className="form-control" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                            <input type="password" className="form-control" placeholder="verify password" onChange={e => setPasswordCheck(e.target.value)} />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                        <p className="forgot-password text-right">
                            Already registered <Link to={"/login"}>Sign-in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
