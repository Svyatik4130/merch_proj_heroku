export default (state = [], action) => {
    switch (action.type) {
        case "SEND_ALL_REPORTS":
            return action.payload
        default:
            return state;
    }
}