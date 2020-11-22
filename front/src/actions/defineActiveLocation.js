export const setActiveLoc = (locationID) => {
    return{
        type: "SET_ACTIVE_LOCATION_FOR_REPORT",
        payload: locationID
    }
}