import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PulseLoader from "react-spinners/PulseLoader";
import { useHistory } from 'react-router-dom'
import axios from 'axios';

export default function ExactLocationsForUser() {
    const userData = useSelector(state => state.userData)
    const [isLoaded, setIsLoaded] = useState(false);
    const [ExactAddresses, setExactAddresses] = useState()
    const history = useHistory();

    function makeReport(locID) {
        history.push(`/main/user/makereport/${locID}`)
    }

    useEffect(() => {
        const getExactLocations = async () => {
            const exactLocations = await axios.post('/locations/getExactResponsibility', { userID: userData.user.id })
            setExactAddresses(exactLocations.data)
        }

        getExactLocations()
        setIsLoaded(true);
    }, [])

    if (!isLoaded || !ExactAddresses) {
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
                {ExactAddresses.usersLocations.length > 1 ? (
                    <>
                    <h2 className="home-title">My addresses</h2>

                    {ExactAddresses.usersLocations.map(address => {
                        return (
                            <div className="address-container" key={address.id}>
                                <p className="address-title">{address.address}</p>
                                <button onClick={() => { makeReport(address.id) }} className="addres-action-button">Make a report</button>
                            </div>
                        );
                    })}
                    </>
                ) : (<h1>You have no active addresses, please contact any admin</h1>)}
            </div>
        )
    }
}
