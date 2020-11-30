import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PulseLoader from "react-spinners/PulseLoader";

import AdminDashboard from './HomeAdmin'
import UserDashboard from './HomeUser'

export default function HomeRoute() {
    const userData = useSelector(state => state.userData)
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!userData.user) history.push('/login')

        setIsLoaded(true);
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
            <>
                {userData.user.role === 1 ? (<AdminDashboard />) : (<UserDashboard/>)}
            </>
        )
    }
}
