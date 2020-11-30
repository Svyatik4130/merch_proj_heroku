import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { sendAllReportsAdmin } from "../../actions/sendAllreports-Admin";
// import axios from "axios";
import { useHistory } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom"
import { setActiveLoc } from "../../actions/defineActiveLocation";

export default function SeeReportsForAdmin() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { id } = useParams()
  const [urlID, seturlID] = useState(id)
  const allAddresses = useSelector(state => state.allAddresses)

  // console.log("1", ActiveLocation)
  const NeddedLoaction = allAddresses.find(address => address.id == urlID)
  useEffect(() => {
    if (allreports !== null) {
      setIsLoaded(true)
    }
  })

  console.log("1", NeddedLoaction)
  // const ActiveLocation = useSelector((state) => state.ActiveLocation);
  const allUsers = useSelector((state) => state.allUsers)
  let allNonAdmins = allUsers.filter(user => user.roleId === 0)
  const history = useHistory();
  const dispatch = useDispatch()
  const allreports = useSelector((state) => state.allreports)
  console.log("2", allreports)
  const onlyNeededReports = allreports.filter(
    (report) => report.locationTitle === NeddedLoaction.address
  )
  const [input, setInput] = useState("")
  const [reports, setReports] = useState({
    htmlreports: [],
    noUsersReports: false,
    isUserSearched: false
  })


  useEffect(() => {
    if (input.length <= 0) {
      setReports({
        htmlreports: onlyNeededReports.map((report) => {
          return (
            <div className='admin-report-container' key={report.id}>
              <p>{report.reportTitle}</p>
              <p>Reporter: <strong>{report.reporterName}</strong></p>
              <p> Report date: <strong>{report.date}</strong> </p>
              <button name='false' className='admin-report-container-btn' onClick={(e) => hideOrDisplayImage(e)}> Show images</button>
              <img className='admin-report-container-img-hidden' src={`/uploads/${report.imageName}.png`} />
            </div>
          )
        }),
        noUsersReports: false
      })
    }
  }, [input])


  function hideOrDisplayImage(e) {
    const btn = e.target;
    const img = e.target.closest("div").children[4];
    if (btn.name === "false") {
      img.className = "admin-report-container-img-visible";
      btn.name = "true";
      btn.innerText = "Hide images";
    } else if (btn.name === "true") {
      img.className = "admin-report-container-img-hidden";
      btn.name = "false";
      btn.innerText = "Show images";
    }
    // use ref (working with dom)
  }

  const handleChange = (e) => {
    e.preventDefault();
    if (!e.target.value.match(/[$-/:-?{-~!"^_`\[\]]/)) {
      setInput(e.target.value);
    }
  }
  if (input.length > 0) {
    allNonAdmins = allNonAdmins.filter((i) => {
      return i.displayName.toLowerCase().match(input.toLowerCase());
    })
  }

  const searchUsersReports = (id, name) => {
    const searchedReports = onlyNeededReports.filter(report => report.reporterID === id)
    if (searchedReports.length > 0) {
      setReports({
        htmlreports: searchedReports.map((report) => {
          return (
            <div className='admin-report-container' key={report.id}>
              <p>{report.reportTitle}</p>
              <p>Reporter: <strong>{report.reporterName}</strong></p>
              <p> Report date: <strong>{report.date}</strong> </p>
              <button name='false' className='admin-report-container-btn' onClick={(e) => hideOrDisplayImage(e)}> Show images</button>
              <img className='admin-report-container-img-hidden' src={`/uploads/${report.imageName}.png`} />
            </div>
          )
        }),
        noUsersReports: false,
        isUserSearched: true
      })
      setInput(name)
    } else {
      setReports({ noUsersReports: true, htmlreports: [], isUserSearched: false })
      setInput(name)
    }
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
      <div className='App'>
        <div className='auth-wrapper'>
          <div className="auth-inner-reports">
            {reports.htmlreports.length <= 0 ? (
              reports.noUsersReports ? (
                <div>
                  <Link to={"/main/admin/locations"}><h5>ᐸ Back to locations</h5></Link>
                  <input type='text' onChange={handleChange} value={input} placeholder='Search user' className='search-input' />
                  <button className="admin-report-container-btn" onClick={() => setInput("")}>Show all reports</button>
                  <h4>This user doesnt have any reports yet...</h4>
                </div>
              ) : (
                  <h2>No reports for this location yet...</h2>
                )
            ) : (
                reports.isUserSearched ? (
                  <div>
                    <Link to={"/main/admin/locations"}><h5>ᐸ Back to locations</h5></Link>
                    <h5> All reports on location:<strong>{NeddedLoaction.address}</strong></h5>
                    <input type='text' onChange={handleChange} value={input} placeholder='Search user' className='search-input' />
                    <button className="admin-report-container-btn" onClick={() => setInput("")}>Show all reports</button>
                    <div className='options'>
                      {allNonAdmins.map((user, index) => {
                        return (
                          <div onClick={() => { searchUsersReports(user._id, user.displayName) }} key={index} className='option'>
                            <p>{user.displayName}</p>
                          </div>
                        );
                      })}
                    </div>
                    {reports.htmlreports}
                  </div>
                ) : (
                    <div>
                      <Link to={"/main/admin/locations"}><h5>ᐸ Back to locations</h5></Link>
                      <h5> All reports on location:<strong>{NeddedLoaction.address}</strong></h5>
                      <div>
                        <input type='text' onChange={handleChange} value={input} placeholder='Search user' className='search-input' />
                        <div className='options'>
                          {allNonAdmins.map((user, index) => {
                            return (
                              <div onClick={() => { searchUsersReports(user._id, user.displayName) }} key={index} className='option'>
                                <p>{user.displayName}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {reports.htmlreports}
                    </div>
                  )
              )
            }
            {/* {reports.htmlreports.length <= 0 ? (<h2>No reports for this location yet...</h2>) : (reports.htmlreports)} */}
          </div >
        </div >
      </div >
    );
  }
}
