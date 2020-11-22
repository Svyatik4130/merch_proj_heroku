export const sendAllReportsAdmin = (allReports) => {
    return{
        type: "SEND_ALL_REPORTS",
        payload: allReports
    }
}