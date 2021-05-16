import React from "react";
import PropTypes from "prop-types";
import axios from 'axios';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      loginSuccess: true,
      email: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }
  handleSubmit = async () => {
    try {
      const response = await axios.post('/admin_login', {"email": this.state.email, "password": this.state.password});
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user_id);
      this.props.history.push('/admin/dashboard');
    } catch (error) {
      this.setState({loginSuccess: false});
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form>
              <Card login className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="primary"
                >
                  <h4 className={classes.cardTitle}>Log in to Admin Panel</h4>
                </CardHeader>
                <CardBody>
                  {!this.state.loginSuccess ? (
                    <SnackbarContent
                      message={"Invalid email/password combination!"}
                      color="rose"
                    />
                  ) : (
                    ""
                  )}
                  <CustomInput
                    labelText="Email..."
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      ),
                      value: this.state.email,
                      onChange: this.handleChange,
                      type: "email"
                    }}
                  />
                  <CustomInput
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputAdornmentIcon}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      ),
                      value: this.state.password,
                      onChange: this.handleChange,
                      type: "password",
                      autoComplete: "off"
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button color="rose" simple size="lg" block onClick={this.handleSubmit}>
                    Log in
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(LoginPage);
