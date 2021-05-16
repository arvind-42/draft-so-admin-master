/*!

=========================================================
* Material Dashboard PRO React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import axios from 'axios';

import AuthLayout from "layouts/Auth.jsx";
import RtlLayout from "layouts/RTL.jsx";
import AdminLayout from "layouts/Admin.jsx";

import "assets/scss/material-dashboard-pro-react.scss?v=1.7.0";

require('dotenv').config();

axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}/api/v1`;

axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${ token }`;
    }
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/rtl" component={RtlLayout} />
      <Route path="/admin" component={AdminLayout} />
      <Route path="/" component={AuthLayout} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
