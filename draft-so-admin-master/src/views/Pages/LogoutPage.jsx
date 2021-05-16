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
import { Redirect } from "react-router-dom";
import axios from 'axios';

export default class LogoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }
  componentDidMount = async () => {
    try {
      await axios.delete('/logout');
      localStorage.clear();
      this.setState({redirect: '/login'});
    } catch (error) {
      this.setState({redirect: '/error'});
    }
  }
  render() {
    return (
      <div>
        {this.state.redirect ? (
          <Redirect to={this.state.redirect} />
        ) : (
          ''
        )}
      </div>
    );
  }
}
