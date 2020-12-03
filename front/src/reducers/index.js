import {combineReducers} from 'redux'
import LoggedUser from './LoggedUser'
import Locations from './locationsOpp'
import getAllUsers from './GetUsers'
import ActiveLocation from './ActiveLocation'
import AllReports from './AllReports'
import pendingUsrs from './pendingUsrs'


const allReducers = combineReducers({
    userData: LoggedUser,
    allUsers: getAllUsers,
    allAddresses: Locations,
    ActiveLocation: ActiveLocation,
    allreports: AllReports,
    pendingUsers: pendingUsrs
})

export default allReducers
