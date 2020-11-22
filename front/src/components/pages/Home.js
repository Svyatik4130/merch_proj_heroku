import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminPanel from '../layout/AdminPanel'
import UserPanel from '../layout/UserPanel'

export default function Home() {
    const userData = useSelector(state => state.userData)
    const history = useHistory();

        if (!userData.user) history.push('/login')

    return (
        <div className="App">
            <div className="auth-wrapper">
                <div className="auth-inner">
                    {userData.user ?(userData.user.role === 1 ? ( <AdminPanel/> ) : ( <UserPanel/> )): (null)}
                </div>
            </div>
        </div>
    )
}
