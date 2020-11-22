import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveLoc } from '../../actions/defineActiveLocation'
import { addAddress } from '../../actions/locationActions'
import { deleteUserRedux } from '../../actions/UserActions'
import { sendAllReportsAdmin } from '../../actions/sendAllreports-Admin'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

export default function AdminPanel() {
    const dispatch = useDispatch()
    const history = useHistory();
    // dispatch(addAddress({_id: "5fa1d35b686bf918b4c9d7ds", id:5, address: "testtesttest" }))

    const allUsers = useSelector(state => state.allUsers)

    const [htmlAllUsers, sethtmlAllUsers] = useState({
        html: allUsers
    })
    const allAddresses = useSelector(state => state.allAddresses)

    const [addAddressAnim, setaddAddressAnim] = useState({
        class: "collapsed",
        buttonHolder: "Add new Location",
        error: null
    })
    const [addAddressAnim_inputValue, setaddAddressAnim_inputValue] = useState({
        value: '',
        status: '',
        statusClassname: 'address-form-status',
    })
    const [viewAllAddresses, setviewAllAddresses] = useState({
        buttonText: "View all addresses ▼",
        allAdressesValues: <></>,
        isOpen: false
    })

    useEffect(() => {
        async function putAllReportsInRedux(){
            let token = localStorage.getItem("auth-token")
            const allReports = await axios.get("/report/getallreports", { headers: { "x-auth-token": token } })
            dispatch(sendAllReportsAdmin(allReports.data))
        }
        putAllReportsInRedux()
    })


    function expand(event) {
        setaddAddressAnim({ class: "expanded", buttonHolder: "Add new Location" })
        var textInput = event.target.closest("#slider").children[1]
        setTimeout(() => {
            textInput.focus()
        }, 500);
    }

    function collapse() {
        setaddAddressAnim({ class: "collapsed", buttonHolder: "Add one more Location" })
    }

    function viewLoactionsORhide() {
        if (viewAllAddresses.isOpen === true) {
            setviewAllAddresses({
                allAdressesValues: <></>,
                buttonText: "View all addresses ▼",
                isOpen: false
            })
            return
        }

        const htmlAddresse = allAddresses.map(address => {
            return (
                <div className="address-container" key={address.id}>
                    <p className="address-title">{address.address}</p>
                    <button onClick={() => { sendToReports(address.id, address.address) }} className="addres-action-button">See reports</button>
                </div>
            )
        })

        setviewAllAddresses({
            allAdressesValues: htmlAddresse,
            buttonText: "Close addresses list ▲",
            isOpen: true
        })
    }

    async function sendToReports(locID, locTitle) {
        try {
            dispatch(setActiveLoc({ id: locID, title: locTitle }))
            history.push("/SeeReports-Admin")

            // send all reports to redux
            let token = localStorage.getItem("auth-token")
            const allReports = await axios.get("/report/getallreports", { headers: { "x-auth-token": token } })
            dispatch(sendAllReportsAdmin(allReports.data))
        } catch (error) {
            console.log(error.response.data.msg)
            console.log(error.message)
        }
    }

    async function submitAddress(e) {
        e.preventDefault()

        try {
            let token = localStorage.getItem("auth-token")

            const addLocation = await axios.post("/locations/add", addAddressAnim_inputValue, { headers: { "x-auth-token": token } })
            if (addLocation.statusText === "OK") {
                setaddAddressAnim_inputValue({ value: '', status: "New address has been successfully added", statusClassname: "address-form-status-ok" })
            }
            console.log(addLocation)
            dispatch(addAddress(addLocation.data))
            collapse()
        } catch (error) {
            console.log(error.response.data.msg)
            console.log(error.message)
            setaddAddressAnim_inputValue({ value: '', status: error.response.data.msg, statusClassname: "address-form-status-err" })
        }
    }

    async function deleteUser(id) {
        try {
            let token = localStorage.getItem("auth-token")
            const statusDeleteUser = await axios.post("/users/deleteUser", { userID: id }, { headers: { "x-auth-token": token } })
            console.log(statusDeleteUser)

            // user deleted
            const indexOfDeleteElem = htmlAllUsers.html.findIndex((user) => { return user._id === id })
            dispatch(deleteUserRedux(indexOfDeleteElem))
            // deleted element in array
            sethtmlAllUsers({
                html: htmlAllUsers.html
            })
        } catch (error) {
            console.log(error.message)
        }
    }


    return (
        <div>
            <h2>All users</h2>
            {htmlAllUsers.html.length > 0 ? (htmlAllUsers.html.map((user) => {
                return (
                    <div key={user._id} className="admin-panel-user-container">
                        <div className="admin-panel-user-container-container">
                            <p className="admin-panel-userName">{user.displayName}</p>
                            <p className="admin-panel-email">{user.email}</p>
                        </div>
                        <button className="admin-panel-deletebtn" onClick={() => { deleteUser(user._id) }}>Delete usr</button>
                    </div>
                )
            })) : (null)}
            <form id='buttonWithText' onSubmit={submitAddress}>
                <div id='slider' className={addAddressAnim.class}>
                    <button type="button" onClick={expand} id='toggle'>{addAddressAnim.buttonHolder}</button>
                    <input type='text' id='address-input' placeholder='New location' size="10" value={addAddressAnim_inputValue.value} onChange={e => setaddAddressAnim_inputValue({ value: e.target.value })} />
                    <input type='submit' id='ok' value='Submit' />
                </div>
            </form>
            <div className={addAddressAnim_inputValue.statusClassname}>
                {addAddressAnim_inputValue.status}
            </div>

            <div className="addresses-for-admin">
                {viewAllAddresses.allAdressesValues}
                <button className="addresses-for-admin-button" onClick={viewLoactionsORhide}>{viewAllAddresses.buttonText}</button>
            </div>
        </div>
    )
}
