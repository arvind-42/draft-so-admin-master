import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import UserProfilePicUpload from "components/CustomUpload/UserProfilePicUpload.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import { withSnackbar } from 'notistack';

import Face from "@material-ui/icons/Face";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import TagFaces from "@material-ui/icons/TagFaces";
import Email from "@material-ui/icons/Email";

import userProfileStyles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.jsx";

const errorMessages = {
    email: "This is not valid email address",
    firstname: "First name has to be at least 3 characters long",
    lastname: "Last name has to be at least 3 characters long",
    username: "User name has to be at least 3 characters long"
}

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: props.user.firstname,
      firstnameState: "",
      lastname: props.user.lastname,
      lastnameState: "",
      email: props.user.email,
      emailState: "",
      username: props.user.username,
      usernameState: "",
      errors: {}
    };
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
  change(event, stateName, type, stateNameEqualTo) {
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
    this.setState({ [stateName]: event.target.value });
  }
  handleSubmit = async () => {
    try {
      if(Object.keys(this.state.errors).length === 0) {
        const user = { email: this.state.email, first_name: this.state.firstname, last_name: this.state.lastname, username: this.state.username };
        const response = await axios.patch(`/users/${localStorage.getItem('userId')}`, user);
        if(response.data.success) {
          this.props.enqueueSnackbar("Profile has been successfully updated", {variant: 'success'});
          this.props.changeUserData(user);
        }
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
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <Card profile>
              <CardAvatar profile>
                <UserProfilePicUpload user={this.props.user} changeUserProfilePic={this.props.changeUserProfilePic} />
              </CardAvatar>
              <CardBody profile>
                <CustomInput
                  success={this.state.emailState === "success"}
                  error={this.state.emailState === "error"}
                  labelText={
                    <span>
                      Email <small>(required)</small>
                    </span>
                  }
                  id="email"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => this.change(event, "email", "email"),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    type: "email",
                    value: this.state.email
                  }}
                />
                <CustomInput
                  success={this.state.firstnameState === "success"}
                  error={this.state.firstnameState === "error"}
                  labelText={
                    <span>
                      First Name <small>(required)</small>
                    </span>
                  }
                  id="firstname"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => this.change(event, "firstname", "length", 3),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Face className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    value: this.state.firstname
                  }}
                />
                <CustomInput
                  success={this.state.lastnameState === "success"}
                  error={this.state.lastnameState === "error"}
                  labelText={
                    <span>
                      Last Name <small>(required)</small>
                    </span>
                  }
                  id="lastname"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => this.change(event, "lastname", "length", 3),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <RecordVoiceOver className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    value: this.state.lastname
                  }}
                />
                <CustomInput
                  success={this.state.usernameState === "success"}
                  error={this.state.usernameState === "error"}
                  labelText={
                    <span>
                      Username <small>(required)</small>
                    </span>
                  }
                  id="username"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => this.change(event, "username", "length", 3),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <TagFaces className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    value: this.state.username
                  }}
                />
                <Button color="rose" className={classes.updateProfileButton} onClick={this.handleSubmit}>
                  Update Profile
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object
};

export default withSnackbar(withStyles(userProfileStyles)(UserProfile));
