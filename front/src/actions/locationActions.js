export const pushAddress = (addresses) => {
    return{
        type: "PUSH_ALLADDRESSES",
        payload: addresses
    }
}
export const addAddress = (addresses) => {
    return{
        type: "ADD_ONEADDRESS",
        payload: addresses
    }
}
export const deleteLocationRedux = (index) => {
    return{
        type: "DELETE_LOCATION",
        payload: index
    }
}