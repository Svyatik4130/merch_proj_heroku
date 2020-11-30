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

    useEffect(() => {
        async function putAllReportsInRedux() {
            let token = localStorage.getItem("auth-token")
            const allReports = await axios.get("/report/getallreports", { headers: { "x-auth-token": token } })
            dispatch(sendAllReportsAdmin(allReports.data))
        }
        putAllReportsInRedux()
    })

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

    const sendToSettingLocationPage = (id) => {
        history.push(`/main/admin/users/setlocation/${id}`)
    }

    return (
        <div>
            <h2>All users</h2>
            {htmlAllUsers.html.length > 0 ? (htmlAllUsers.html.map((user) => {
                return (
                    <div key={user._id} className="admin-panel-user-container">
                        <div className="inner-admin-panel-user-container-container">
                            <div className="admin-panel-user-container-container">
                                <p className="admin-panel-userName">{user.displayName}</p>
                                <p className="admin-panel-email">{user.email}</p>
                            </div>
                            {user.roleId === 0 ? (<button className="addres-action-button" onClick={() => { sendToSettingLocationPage(user._id) }}> Set locations for this user</button>) : (null)}
                        </div>
                        <button className="admin-panel-deletebtn" onClick={() => { deleteUser(user._id) }}>Delete usr</button>
                    </div>
                )
            })) : (null)}
            {/* <form id='buttonWithText' onSubmit={submitAddress}>
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
            </div> */}
        </div>
    )
}
