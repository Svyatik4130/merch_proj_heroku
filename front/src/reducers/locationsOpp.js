export default (state = [], action) => {
    switch (action.type) {
        case "PUSH_ALLADDRESSES":
            return action.payload
        case "ADD_ONEADDRESS":
            return [...state, action.payload]
        case "DELETE_LOCATION":
            if (action.payload > -1) {
                state.splice(action.payload, 1)
            }
            return state
        default:
            return state;
    }
}