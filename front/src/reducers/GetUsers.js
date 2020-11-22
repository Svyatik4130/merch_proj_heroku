export default (state = [], action) => {
    switch (action.type) {
        case "GET_USERS":
            return action.payload
        case "DELETE_USER":
            console.log(state)
            if(action.payload > -1){
                state.splice(action.payload, 1)
            }
            return state
        default:
            return state;
    }
}