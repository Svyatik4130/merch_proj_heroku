import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PulseLoader from "react-spinners/PulseLoader";
import { useHistory } from 'react-router-dom'

import EmptyPage from '../misc/EmptyPage'

export default function RecentUserReports() {
    const userData = useSelector(state => state.userData)
    const [isLoaded, setIsLoaded] = useState(false);
    const history = useHistory();
    const allreports = useSelector(state => state.allreports).sort((a, b) => {
        const one = Number(b.date.split(".").join("").split(":").join(''))
        const two = Number(a.date.split(".").join("").split(":").join(''))
        return one - two
    })

    useEffect(() => {
        setIsLoaded(true);
    }, [])

    function hideOrDisplayImage(e) {
        const btn = e.target;
        const img = e.target.closest("div").children[4];
        if (btn.name === "false") {
            img.className = "admin-report__images";
            btn.name = "true";
            btn.innerText = "Hide images";
        } else if (btn.name === "true") {
            img.className = "admin-report__images-hidden";
            btn.name = "false";
            btn.innerText = "Show images";
        }
        // use ref (working with dom)
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
            <div>
                {allreports.length > 0 ? (
                    <>
                        <h2 className="home-title">My reports</h2>

                        {allreports.map(report => {
                            const images = report.images.map(source => {
                                return (<img src={source} alt={source} />)
                            })
                            return (
                                <div className='admin-report-container' key={report.id}>
                                    <p>{report.reportTitle}</p>
                                    <p>Reporter: <strong>{report.reporterName}</strong></p>
                                    <p> Report date: <strong>{report.date}</strong> </p>
                                    <button name='false' className='admin-report-container-btn' onClick={(e) => hideOrDisplayImage(e)}> Show images</button>
                                    <div className="admin-report__images-hidden">
                                        {images}
                                    </div>
                                </div>
                            )
                        })}

                    </>
                ) : (<EmptyPage text={"You have no reports yet"} />)}
            </div>
        )
    }
}
