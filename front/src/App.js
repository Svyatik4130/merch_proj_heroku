import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import "./index.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import { loggedUser } from "./actions/UserActions";
import { useDispatch } from "react-redux";
import { pushAddress } from "./actions/locationActions";
import { getAllUsers } from "./actions/UserActions";

import Report from "./components/pages/AddReport";
import SeeReportsForAdmin from "./components/pages/SeeReportsForAdmin";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
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
          dispatch(getAllUsers(allUsers.data));
        }

        const allLocations = await axios.get("/locations/alllocations");
        dispatch(pushAddress(allLocations.data));
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
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
            <Route path="/makereport">
              <Report />
            </Route>
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
