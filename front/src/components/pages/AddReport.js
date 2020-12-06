import React, { useEffect, useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom"
import ErrorNotice from '../misc/ErrorNotice'

import { sendAllReportsAdmin } from '../../actions/sendAllreports-Admin'

export default function AddReport() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const history = useHistory();
    const userData = useSelector(state => state.userData)
    const [isLoaded, setIsLoaded] = useState(false);
    const [areFilesLoaded, setareFilesLoaded] = useState(false);
    const AllAddresses = useSelector(state => state.allAddresses)
    const activeLoc = AllAddresses.find(address => address.id == id)
    const [ActiveLocation, setActiveLocation] = useState(activeLoc)
    const allreports = useSelector(state => state.allreports)
    const [error, setError] = useState()
    const [status, setStatus] = useState()
    const [Report, setReport] = useState({
        value: ""
    })
    const [e, sete] = useState()
    const [imagesNames, setimagesNames] = useState([])
    const [htmlImages, sethtmlImages] = useState([])
    const [final, setfinal] = useState([])
    const [Files, setFiles] = useState([])
    useEffect(() => {
        if (!userData.user) history.push('/login')
        setIsLoaded(true);
    }, [])

    let statusStyle = {
        "color": "green"
    }

    async function submit(e) {
        e.preventDefault()
        sete(e)
        try {
            const filesArr = Array.from(Files)
            filesArr.map(async (file, index) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "reportImages");
                const cloud = await axios.post("https://api.cloudinary.com/v1_1/dgyltqv47/image/upload", formData);
                // console.log(cloud.data.secure_url)
                setimagesNames(imagesNames.push(cloud.data.secure_url));
                if (index === filesArr.length - 1) {
                    setTimeout(() => {
                        console.log(index, filesArr.length)
                        setfinal(imagesNames)
                        setareFilesLoaded(true)
                        console.log(imagesNames)
                    }, 500);
                }
                // console.log(imagesNames)
            })
        } catch (error) {
            // console.log(error.response.data)
            console.log(error.message)
            // error.response.data.msg && setError(error.response.data.msg)
        }
    }

    useEffect(() => {
        const addReport = async () => {
            try {
                let token = localStorage.getItem("auth-token")
                // console.log(Array.from(imagesNames))
                const date = new Date()
                const saveReportimg = await axios.post("/report/add", {
                    reportValue: Report.value,
                    locTitle: ActiveLocation.address,
                    userName: userData.user.displayName,
                    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                    imagesNames: final
                }, { headers: { "x-auth-token": token } })
                console.log(saveReportimg)

                dispatch(sendAllReportsAdmin(allreports.push(saveReportimg.data)))

                e.target.children[0].children[1].value = ''
                setReport({ value: "" })
                if (saveReportimg.statusText === "OK") {
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
                sethtmlImages([])


            } catch (error) {
                console.log(error.message)
                error.response.data.msg && setError(error.response.data.msg)
            }
        }
        if (areFilesLoaded) {
            addReport()
        }
        // setareFilesLoaded(false)
    }, [areFilesLoaded])


    function saveFiles(e) {
        setFiles(e.target.files)
        sethtmlImages([])
        if (e.target.files) {
            const fileArr = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
            sethtmlImages((prevImages) => prevImages.concat(fileArr))
        }
        Array.from(e.target.files).map(file => URL.revokeObjectURL(file))
    }

    const renderPhotos = (source) => {
        return source.map((photo) => {
            return (
                <img src={photo} key={photo} />
            )
        })
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
                <p>Make report for location: <strong>{ActiveLocation.address}</strong></p>
                <form onSubmit={(e) => submit(e)}>
                    {/* <input type='text' placeholder='What have you changed' value={Report.value} onChange={e => setReport({ value: e.target.value })} /> */}
                    <div className="report-form">
                        <h5>Upload your photo from the shop:</h5>
                        <input type="file" accept=".png, .jpg, .jpeg" multiple className="file-input" id="file" onChange={(e) => { saveFiles(e) }} />
                        {/* <input type="file" id="input-b4b" name="input-b4b" class="file" disabled="true" onChange={(e) => saveFile(e)} /> */}
                        <div className="img-preview">
                            {renderPhotos(htmlImages)}
                        </div>
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
