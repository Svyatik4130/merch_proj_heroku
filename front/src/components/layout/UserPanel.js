import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setActiveLoc } from '../../actions/defineActiveLocation'

export default function UserPanel() {
    const allAddresses = useSelector(state => state.allAddresses)
    const history = useHistory();
    const dispatch = useDispatch()

    function makeReport(locID, locTitle) {
        dispatch(setActiveLoc({id: locID, title: locTitle}))
        history.push("/makereport")
    }

    return (
        <div>
            <h2 className="home-title">My addresses</h2>
            {allAddresses.map(address => {
                return (
                    <div className="address-container" key={address.id}>
                        <p className="address-title">{address.address}</p>
                        <button onClick={() => { makeReport(address.id, address.address) }} className="addres-action-button">Make a report</button>
                    </div>
                )
            })}
        </div>
    )
}
