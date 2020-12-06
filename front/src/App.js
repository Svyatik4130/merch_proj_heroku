import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import "./index.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import { loggedUser } from "./actions/UserActions";
import { useDispatch } from "react-redux";
import { pushAddress } from "./actions/locationActions";
import { getAllUsers } from "./actions/UserActions";
import { getAllPendingUsers } from "./actions/UserActions";
import { sendAllReportsAdmin } from './actions/sendAllreports-Admin'


import SeeReportsForAdmin from "./components/pages/SeeReportsForAdmin";
import Header from "./components/layout/Header";
import HomeRoute from "./components/pages/HomeRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/pages/PersonalInfo";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await axios.post("/users/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });
      if (tokenRes.data) {
        const userRespond = await axios.get("/users/", {
          headers: { "x-auth-token": token },
        });
        dispatch(
          loggedUser({
            token,
            user: userRespond.data,
          })
        );

        if (userRespond.data.role === 1) {
          const allUsers = await axios.get("/users/getallusers");
          dispatch(getAllUsers(allUsers.data.filter(user => !user.pending)));

          let token = localStorage.getItem("auth-token")
          const allReports = await axios.get("/report/getallreports", { headers: { "x-auth-token": token } })
          dispatch(sendAllReportsAdmin(allReports.data))

          const pendingUsers = await allUsers.data.filter(user => user.pending)
          dispatch(getAllPendingUsers(pendingUsers))
        }

        if (!userRespond.data.pending) {
          const allLocations = await axios.get("/locations/alllocations");
          dispatch(pushAddress(allLocations.data));

          if (userRespond.data.role !== 1) {
            let token = localStorage.getItem("auth-token")
            const allReports = await axios.get("/report/getuserreports", { headers: { "x-auth-token": token } })
            dispatch(sendAllReportsAdmin(allReports.data))
          }
        }
      }

      setIsLoaded(true);
    };
    checkLoggedIn();
  });

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
      <Router>
        <Header />
        <div className="container">
          <Switch>
            <Route path="/main" component={HomeRoute} />
            <Route path="/login" component={Login} />
            <Route exact path="/" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
            <Route path="/seereports-admin">
              <SeeReportsForAdmin />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
