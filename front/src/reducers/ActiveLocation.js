export default (state = { id: undefined, title: undefined }, action) => {
    switch (action.type) {
        case "SET_ACTIVE_LOCATION_FOR_REPORT":
            return action.payload
        default:
            return state;
    }
}