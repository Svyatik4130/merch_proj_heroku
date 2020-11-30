import React, { useEffect, useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom"
import ErrorNotice from '../misc/ErrorNotice'

export default function AddReport() {
    const { id } = useParams()
    const userData = useSelector(state => state.userData)
    const [isLoaded, setIsLoaded] = useState(false);
    const AllAddresses = useSelector(state => state.allAddresses)
    const activeLoc = AllAddresses.find(address => address.id == id)
    const [ActiveLocation, setActiveLocation] = useState(activeLoc)
    const history = useHistory();
    const [error, setError] = useState()
    const [status, setStatus] = useState()
    const [Report, setReport] = useState({
        value: ""
    })
    const [File, setFile] = useState()
    useEffect(() => {
        if (!userData.user) history.push('/login')

        // setActiveLocation(AllAddresses.find(address => address.id === id))

        setIsLoaded(true);
    }, [])

    let statusStyle = {
        "color": "green"
    }

    async function submit(e) {
        e.preventDefault()

        let token = localStorage.getItem("auth-token")

        const formData = new FormData()
        const date = new Date()
        formData.append("file", File)
        formData.append("reportValue", Report.value)
        formData.append("locTitle", ActiveLocation.address)
        formData.append("userName", userData.user.displayName)
        formData.append("date", `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
        try {
            const savedReport = await axios.post("/report/add", formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    "x-auth-token": token
                }
            })
            console.log(savedReport)
            e.target.children[0].children[1].value = ''
            setReport({ value: "" })
            if (savedReport.statusText === "OK") {
                setStatus("You have added new report for this location")
                setTimeout(() => {
                    setStatus("")
                }, 5000);
            } else {
                setStatus("Someting went wrong")
                statusStyle["color"] = "red"
                setTimeout(() => {
                    setStatus("")
                }, 5000);
            }
        } catch (error) {
            console.log(error.response.data)
            console.log(error.message)
            error.response.data.msg && setError(error.response.data.msg)
        }
    }
    function saveFile(e) {
        setFile(e.target.files[0])
    }

    if (!isLoaded) {
        return (
            <div className="container">
                <div className="preloader">
                    <PulseLoader size={60} color={"#fff"} loading={!isLoaded} />
                </div>
            </div>
        )
    } else {
        return (
            <>
                <Link to={"/main/user/locations"}><h5>ᐸ Back</h5></Link>
                <p>Make report for location<strong>{ActiveLocation.address}</strong></p>
                <form onSubmit={(e) => submit(e)}>
                    {/* <input type='text' placeholder='What have you changed' value={Report.value} onChange={e => setReport({ value: e.target.value })} /> */}
                    <div className="report-form">
                        <h5>Upload your photo from the shop:</h5>
                        <input type="file" className="file-input" id="file" onChange={(e) => { saveFile(e) }} />
                        {/* <input type="file" id="input-b4b" name="input-b4b" class="file" disabled="true" onChange={(e) => saveFile(e)} /> */}
                        <h5 style={{ "marginTop": "10px" }}>Described completed work:</h5>
                        <textarea placeholder="Write something that you have done" value={Report.value} className="report-form-textarea" onChange={e => setReport({ value: e.target.value })}></textarea>
                        {/* <div contenteditable="true" className="address-report-div-textarea-user" onChange={() => {console.log("1")}} placeholder="Write something that you have done"></div> */}
                        {error && <ErrorNotice message={error} clearError={() => { setError(undefined) }} />}
                        <button className="report-form-subm-btn" type="submit">Submit</button>
                        <p style={statusStyle}>{status}</p>
                    </div>
                </form>
            </>
        )
    }
}
