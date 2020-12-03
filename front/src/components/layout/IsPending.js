import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader";

export default function IsPending() {
    const history = useHistory()
    const [User, setUser] = useState()

    useEffect(() => {
        const getUser = async () => {
            let token = localStorage.getItem("auth-token")
            const { data } = await axios.get("/users/", { headers: { "x-auth-token": token } })
            if (!data.pending) {
                history.push("/main/user/locations")
            }
            setUser(data)
        }
        getUser()
    }, [])
    if (User) {
        return (
            <div className="emptypage-container">
                <img src={"/uploads/admin.png"} alt="empty" className="emptypage-container-img" />
                <p className="emptypage-container-text">You are not registered yet, please contact the admin to confirm your registration</p>
            </div>
        )
    } else {
        return(
            <div className="container">
                <div className="preloader">
                    <PulseLoader size={60} color={"#2182e4"} loading={true} />
                </div>
            </div>
        )
    }
}
