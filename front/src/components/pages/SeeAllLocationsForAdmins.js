import React, { useState, useEffect } from 'react'
import PulseLoader from "react-spinners/PulseLoader"
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { deleteLocationRedux } from '../../actions/locationActions'



export default function SeeAllLocationsForAdmins() {
    const dispatch = useDispatch()
    const history = useHistory();
    const [viewAllAddresses, setviewAllAddresses] = useState({
        allAdressesValues: <></>,
    })
    const allAddresses = useSelector(state => state.allAddresses)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const htmlAddresse = allAddresses.map(address => {
            return (
                <div className="address-container" key={address.id}>
                    <p className="address-title">{address.address}</p>
                    <div className="address-action-buttons" >
                        <button onClick={() => { sendToReports(address.id, address.address) }} className="addres-action-button">Reports</button>
                        <button onClick={() => { deleteLocation(address._id) }} className="admin-panel-deletebtn">Delete this location</button>
                    </div>
                </div>
            )
        })

        setviewAllAddresses({
            allAdressesValues: htmlAddresse
        })
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        const htmlAddresse = allAddresses.map(address => {
            return (
                <div className="address-container" key={address.id}>
                    <p className="address-title">{address.address}</p>
                    <div className="address-action-buttons" >
                        <button onClick={() => { sendToReports(address.id, address.address) }} className="addres-action-button">Reports</button>
                        <button onClick={() => { deleteLocation(address._id) }} className="admin-panel-deletebtn">Delete this location</button>
                    </div>
                </div>
            )
        })

        setviewAllAddresses({
            allAdressesValues: htmlAddresse
        })
    }, [allAddresses])

    const deleteLocation = async (id) => {
        try {
            let token = localStorage.getItem("auth-token")
            const statusDeleteLocation = await axios.post("/locations/deleteLocation", { locId: id }, { headers: { "x-auth-token": token } })
            console.log(statusDeleteLocation)

            // Location deleted
            const indexOfDeleteElem = allAddresses.findIndex((loc) => { return loc._id === id })
            dispatch(deleteLocationRedux(indexOfDeleteElem))

            let newArrayWithdeletedElem = allAddresses

            // if (indexOfDeleteElem > -1) {
            //     newArrayWithdeletedElem.splice(indexOfDeleteElem, 1)
            // }

            // deleted element in array
            setviewAllAddresses({
                allAdressesValues: newArrayWithdeletedElem.map(address => {
                    return (
                        <div className="address-container" key={address.id}>
                            <p className="address-title">{address.address}</p>
                            <div className="address-action-buttons" >
                                <button onClick={() => { sendToReports(address.id, address.address) }} className="addres-action-button">Reports</button>
                                <button onClick={() => { deleteLocation(address._id) }} className="admin-panel-deletebtn">Delete this location</button>
                            </div>
                        </div>
                    )
                })
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    async function sendToReports(locID) {
        try {
            // dispatch(setActiveLoc({ id: locID, title: locTitle }))
            history.push(`/main/admin/locations/reports/${locID}`)

            // send all reports to redux
            // let token = localStorage.getItem("auth-token")
            // const allReports = await axios.get("/report/getallreports", { headers: { "x-auth-token": token } })
            // dispatch(sendAllReportsAdmin(allReports.data))
        } catch (error) {
            console.log(error.response.data.msg)
            console.log(error.message)
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
            <>
                <h2>All locations</h2>
                <div className="addresses-for-admin">
                    {viewAllAddresses.allAdressesValues}
                </div>
            </>
        )
    }
}
