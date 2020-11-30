import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'

import ErrorNotice from '../misc/ErrorNotice'

export default function SetLoactionForUser() {
    const { id } = useParams()
    let allAddresses = useSelector(state => state.allAddresses)

    const [error, setError] = useState()
    const [isLoaded, setIsLoaded] = useState(false)
    const allUsers = useSelector(state => state.allUsers)
    const thisUser = allUsers.find(user => user._id == id)
    // const [thisAllAddresses, setthisAllAddresses] = useState(allAddresses)
    const [HtmlAddresses, setHtmlAddresses] = useState(null)


    useEffect(() => {
        allAddresses.map(location => { location.isChecked = false })
        const setTicks = async () => {

            const { data } = await axios.get("/locations/getResponsibilities")
            console.log(data)
            if (data) {
                const foundArr = data.find((responsibility) => responsibility.userId === thisUser._id)
                if (foundArr) {
                    foundArr.usersLocations.forEach((address) => {
                        const foundAddressIntoAddress = allAddresses.find((location) => { return location._id === address._id })
                        if (foundAddressIntoAddress) {
                            console.log(allAddresses)
                            allAddresses.map(location => {
                                if (location._id === foundAddressIntoAddress._id) {
                                    location.isChecked = true
                                }
                            })
                        }
                    })
                }
            }

            setHtmlAddresses(allAddresses.map(location => {
                return (
                    <div className="loc-checkbox" key={location.id} onClick={() => { handleLocationChange(location.id) }}>
                        <Form.Check type={'checkbox'} checked={location.isChecked} label={location.address}></Form.Check>
                    </div>
                )
            }))
        }
        setTicks()

        setIsLoaded(true)
    }, [])

    const handleLocationChange = (locId) => {
        const neededIndex = allAddresses.findIndex((address) => address.id === locId)
        const newArr = allAddresses
        // console.log(thisAllAddresses)
        newArr[neededIndex].isChecked = !newArr[neededIndex].isChecked
        // setthisAllAddresses(newArr)
        setHtmlAddresses(newArr.map(location => {
            return (
                <div className="loc-checkbox" key={location.id} onClick={() => { handleLocationChange(location.id) }}>
                    <Form.Check type={'checkbox'} checked={location.isChecked} label={location.address}></Form.Check>
                </div>
            )
        }))
    }

    const submit = async () => {
        const tickedAddresses = allAddresses.filter(address => address.isChecked === true)
        try {
            let token = localStorage.getItem("auth-token")
            const sentObligations = await axios.post('/locations/setLocationForUser', [thisUser, tickedAddresses], { headers: { "x-auth-token": token } })
            console.log(sentObligations)
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    if (!isLoaded || HtmlAddresses === null) {
        return (
            <div className="container">
                <div className="preloader">
                    <PulseLoader size={60} color={"#fff"} loading={!isLoaded} />
                </div>
            </div>
        )
    } else {
        return (
            <div className='App'>
                <div className='auth-wrapper'>
                    <div className="auth-inner-reports">
                        <div className="setLocationForUser-title">
                            <p className="setLocationForUser-title-desc">Select required locations for: </p>
                            <p className="setLocationForUser-title-user">{thisUser.displayName}</p>
                        </div>
                        {error && <ErrorNotice message={error} clearError={() => { setError(undefined) }} />}
                        <div className="setLocationForUser-checkboxes">
                            {HtmlAddresses}
                        </div>
                        <button onClick={() => submit()} >Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}
