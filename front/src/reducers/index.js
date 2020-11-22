import {combineReducers} from 'redux'
import LoggedUser from './LoggedUser'
import Locations from './locationsOpp'
import getAllUsers from './GetUsers'
import ActiveLocation from './ActiveLocation'
import AllReports from './AllReports'


const allReducers = combineReducers({
    userData: LoggedUser,
    allUsers: getAllUsers,
    allAddresses: Locations,
    ActiveLocation: ActiveLocation,
    allreports: AllReports
})

export default allReducers
