import React from "react";
import axios from "axios";
import moment from 'moment';
import PropTypes from "prop-types";
import Datetime from "react-datetime";
import MaterialTable from "material-table";
import Assignment from "@material-ui/icons/Assignment";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from '@material-ui/core/Input';
import InputAdornment from "@material-ui/core/InputAdornment";
import AttachMoney from '@material-ui/icons/AttachMoney';
import { withSnackbar } from 'notistack';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";

const cardStyle = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

const formStyles = {...extendedFormsStyle, selectFormControlSelectWithInput: {margin: "18px 0 17px 0 !important"}, selectFormControlDatePickerWithInput: {margin: "31px 0 17px 0 !important"}}

const styles = {...sweetAlertStyle, ...cardStyle, ...formStyles}

const errorMessages = {
    email: "This is not valid email address",
    firstname: "First name has to be at least 3 characters long",
    lastname: "Last name has to be at least 3 characters long",
    username: "User name has to be at least 3 characters long",
    password: "Password has to be at least 3 characters long",
    passwordConfirm: "Password has to be at least 3 characters long",
    resetPassword: "Password has to be at least 3 characters long"
}

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      show: false,
      columns: [
        { title: 'First Name', field: 'first_name' },
        { title: 'Last Name', field: 'last_name' },
        { title: 'Email', field: 'email' },
        { title: 'Username', field: 'username' },
        { title: 'Created', field: 'created_at', type: 'datetime', render: data => data ? moment(data.created_at).format('DD-MM-YYYY') : "", editable: 'never' }
      ],
      selectedGender: 'Male',
      data: props.users.filter(user => user.id !== Number(localStorage.getItem('userId'))),
      firstNameState: "", lastNameState: "", usernameState: "", emailState: "", passwordState: "", passwordConfirmState: "", salaryCapState: "", birthDateState: "", resetPasswordState: "",
      form: { firstName: "", lastName: "", username: "", email: "", password: "", passwordConfirm: "", salaryCap: "", birthDate: "", gender: "", resetPassword: "" },
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.successCreate = this.successCreate.bind(this);
    this.cancelCreate = this.cancelCreate.bind(this);
    this.successResponsePopup = this.successResponsePopup.bind(this);
    this.errorResponsePopup = this.errorResponsePopup.bind(this);
  }
  verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }
  verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  }
  handleChange(event, stateName, type, stateNameEqualTo) {
    const eventId = event.target.id
    const eventValue = event.target.value

    switch (type) {
      case "email":
        if (this.verifyEmail(event.target.value)) {
          const { email, ...errors } = this.state.errors;
          this.setState({ [stateName + "State"]: "success", errors: errors });
        } else {
          this.setState(prevState => ({ [stateName + "State"]: "error", errors: {...prevState.errors, email: errorMessages.email} }));
        }
        break;
      case "length":
        if (this.verifyLength(event.target.value, stateNameEqualTo)) {
          let errors = Object.assign({}, this.state.errors);
          delete errors[stateName];
          this.setState({ [stateName + "State"]: "success", errors: errors });
        } else {
          this.setState(prevState => ({ [stateName + "State"]: "error", errors: {...prevState.errors, [stateName]: errorMessages[stateName]} }));
        }
        break;
      default:
        break;
    }
    this.setState(prevState => ({ form: {...prevState.form, [eventId]: eventValue }}));
  }
  handleSelectChange(event) {
    const eventValue = event.target.value
    this.setState({ selectedGender: eventValue });
    this.inputAlert(this.state.rowData, this.state.classes, eventValue)
  }
  hideAlert() {
    this.setState({
      alert: null
    });
  }
  inputConfirmAlert(e) {
    this.setState({ alert: e });
    setTimeout(this.inputConfirmAlertNext, 200);
  }
  successCreate() {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-300px" }}
          title="Created!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          User has been successfully created
        </SweetAlert>
      )
    });
  }
  cancelCreate() {
    this.setState({
      alert: (
        <SweetAlert
          danger
          style={{ display: "block", marginTop: "-300px" }}
          title="Cancelled"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          Given user already exists
        </SweetAlert>
      )
    });
  }
  successResponsePopup(message) {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-300px" }}
          title="Success!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          {message}
        </SweetAlert>
      )
    });
  }
  errorResponsePopup(message) {
    this.setState({
      alert: (
        <SweetAlert
          danger
          style={{ display: "block", marginTop: "-300px" }}
          title="Cancelled"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          {message}
        </SweetAlert>
      )
    });
  }
  inputAlert(rowData, classes, selectedGender) {
    this.setState({
      rowData: rowData,
      classes: classes,
      alert: (
        <SweetAlert
          showCancel
          title="Create a user"
          style={{ display: "block", marginTop: "-300px" }}
          onConfirm={e => this.createUser(rowData)}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.info
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
        >
          <form className={classes.container}>
            <GridContainer>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Email"
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.email,
                      onChange: event => this.handleChange(event, "email", "email"),
                      type: "email"
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.username,
                      onChange: event => this.handleChange(event, "username", "length", 3)
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="First Name"
                    id="firstName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.firstName,
                      onChange: event => this.handleChange(event, "firstName", "length", 3)
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Last Name"
                    id="lastName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.lastName,
                      onChange: event => this.handleChange(event, "lastName", "length", 3)
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={4}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Salary Cap"
                    id="salaryCap"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.salaryCap,
                      onChange: event => this.handleChange(event, "salaryCap", "length", 1),
                      endAdornment: (<InputAdornment position="end"><AttachMoney/></InputAdornment>)
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={5}>
                <FormControl fullWidth className={classes.selectFormControlDatePickerWithInput}>
                  <Datetime
                    timeFormat={false}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      id: "birthDate",
                      placeholder: "Birth Date",
                      value: this.state.birthDate,
                      autoComplete: "off"
                    }}
                    onChange={(date) => {document.getElementById("birthDate").value = moment(date).format('DD-MM-YYYY'); this.setState(prevState => ({ form: {...prevState.form, birthDate: moment(date).format('YYYY-MM-DD') }}))}}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={3}>
                <FormControl fullWidth className={classes.selectFormControlSelectWithInput}>
                  <InputLabel htmlFor="gender">Gender</InputLabel>
                  <Select
                      native
                      value={selectedGender}
                      onChange={this.handleSelectChange}
                      input={<Input id="gender" />}
                    >
                    <option value="Male" key="1">Male</option>
                    <option value="Female" key="2">Female</option>
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.password,
                      onChange: event => this.handleChange(event, "password", "length", 3),
                      type: "password",
                      autoComplete: "off"
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Password Confirmation"
                    id="passwordConfirm"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.passwordConfirm,
                      onChange: event => this.handleChange(event, "passwordConfirm", "length", 3),
                      type: "password",
                      autoComplete: "off"
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
          </form>
        </SweetAlert>
      )
    });
  }
  resetPasswordAlert(rowData, classes) {
    this.setState({
      rowData: rowData,
      classes: classes,
      alert: (
        <SweetAlert
          showCancel
          title="Reset password"
          style={{ display: "block", marginTop: "-300px" }}
          onConfirm={e => this.passwordReset(rowData)}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.info
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
        >
          <form className={classes.container}>
            <GridContainer>
              <GridItem xs={12}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="New Password"
                    id="resetPassword"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.resetPassword,
                      onChange: event => this.handleChange(event, "resetPassword", "length", 3),
                      type: "password",
                      autoComplete: "off"
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
          </form>
        </SweetAlert>
      )
    });
  }
  createUser = async (rowData) => {
    try {
      if(Object.keys(this.state.errors).length === 0 && this.state.form.email.length > 0) {
        const userData = {
          first_name: this.state.form.firstName,
        	last_name: this.state.form.lastName,
        	username: this.state.form.username,
        	salary_cap: this.state.form.salaryCap,
          email: this.state.form.email,
          password: this.state.form.password,
          password_confirmation: this.state.form.passwordConfirm,
          birth_date: this.state.form.birthDate,
          gender: this.state.selectedGender
        }
        await axios.post('/signup', {user: userData});
        setTimeout(this.successCreate, 200);
        await this.refreshUsersData();
      } else {
        Object.values(this.state.errors).forEach((message) => {
            this.props.enqueueSnackbar(message, {
              variant: 'error'
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  refreshUsersData = async () => {
    try {
      const response = await axios.get('/users');
      this.setState({ data: response.data.content.filter(user => user.id !== Number(localStorage.getItem('userId'))) });
    } catch (error) {
      console.error(error);
    }
  }
  setAsAdmin = async (rowData) => {
    try {
      await axios.post('/set_admin', {user_id: rowData.id});
      setTimeout(this.successResponsePopup("Admin has been set successfully"), 200);
    } catch (error) {
      setTimeout(this.errorResponsePopup("User doesn't exist"), 200);
    }
  }
  removeFromAdmin = async (rowData) => {
    try {
      const response = await axios.post('/remove_admin', {user_id: rowData.id});
      if(response.data.success) {
        setTimeout(this.successResponsePopup("Admin has been removed successfully"), 200);
      } else {
        setTimeout(this.errorResponsePopup(response.data.content), 200);
      }
    } catch (error) {
      setTimeout(this.errorResponsePopup("User doesn't exist or user is trying to remove himself from admin group"), 200);
    }
  }
  passwordReset = async (rowData) => {
    try {
      if(Object.keys(this.state.errors).length === 0 && this.state.form.resetPassword.length > 0) {
        const response = await axios.post('/reset_password', {email: rowData.email, password: this.state.form.resetPassword});
        if(response.data.success) {
          setTimeout(this.successResponsePopup("Password has been reset successfully"), 200);
        } else {
          setTimeout(this.errorResponsePopup(response.data.content), 200);
        }
      } else {
        Object.values(this.state.errors).forEach((message) => {
            this.props.enqueueSnackbar(message, {
              variant: 'error'
          });
        });
      }
    } catch (error) {
      setTimeout(this.errorResponsePopup("Password could not be reset"), 200);
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.alert}
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Users</h4>
              </CardHeader>
              <CardBody>
              <MaterialTable
                style={{boxShadow: "none", border: 0}}
                title=""
                columns={this.state.columns}
                data={this.state.data}
                editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        {
                          const data = this.state.data;
                          const index = data.indexOf(oldData);
                          data[index] = newData;
                          this.setState({ data }, () => {
                            axios.patch(`/users/admin_update/${newData.id}`, { email: newData.email, first_name: newData.first_name, last_name: newData.last_name, username: newData.username });
                            resolve()
                          });
                        }
                        resolve()
                      }, 1000)
                    }),
                }}
                actions={[
                  {
                    icon: 'add',
                    tooltip: 'Create a user',
                    isFreeAction: true,
                    onClick: (event, rowData) => this.inputAlert(rowData, classes, this.state.selectedGender)
                  },
                  {
                    icon: 'refresh',
                    tooltip: 'Refresh Data',
                    isFreeAction: true,
                    onClick: () => this.refreshUsersData()
                  },
                  {
                    icon: 'person_add',
                    tooltip: 'Set as admin',
                    onClick: (event, rowData) => this.setAsAdmin(rowData)
                  },
                  {
                    icon: 'person_add_disabled',
                    tooltip: 'Remove admin',
                    onClick: (event, rowData) => this.removeFromAdmin(rowData)
                  },
                  {
                    icon: 'fingerprint',
                    tooltip: 'Reset password',
                    onClick: (event, rowData) => this.resetPasswordAlert(rowData, classes)
                  },
                ]}
              />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

UsersPage.propTypes = {
  classes: PropTypes.object
};

export default withSnackbar(withStyles(styles)(UsersPage));
