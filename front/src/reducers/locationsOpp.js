export default (state = [], action) => {
    switch (action.type) {
        case "PUSH_ALLADDRESSES":
            return action.payload
        case "ADD_ONEADDRESS":
            return [...state, action.payload]
        default:
            return state;
    }
}