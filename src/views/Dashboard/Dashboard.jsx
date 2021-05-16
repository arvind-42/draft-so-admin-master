import React from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import ChartistGraph from "react-chartist";
import moment from 'moment';
import axios from "axios";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";

import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWallet";
import Payment from "@material-ui/icons/Payment";
import Refresh from "@material-ui/icons/Refresh";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import FormControl from "@material-ui/core/FormControl";

import InputAdornment from "@material-ui/core/InputAdornment";
import AttachMoney from '@material-ui/icons/AttachMoney';

import {
  dailySalesChart
} from "variables/charts";

import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

const styles = {...sweetAlertStyle, ...dashboardStyle}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const labels = [].concat(...props.transactions.map((tx) => moment(tx.created_at).format('DD-MM-YYYY')));
    const series = [].concat(...props.transactions.map((tx) => tx.balance));
    this.state = {
      alert: null,
      show: false,
      classes: "",
      value: 0,
      data: {
        labels: labels,
        series: [series]
      },
      table: {
        columns: [
          { title: 'User email', field: 'email'},
          { title: 'Username', field: 'user_name'},
          { title: 'User First Name', field: 'first_name'},
          { title: 'User Last Name', field: 'last_name'},
          { title: 'Amount', field: 'amount', type: 'currency'},
          { title: 'Balance', field: 'balance', type: 'currency'},
          { title: 'Operation', field: 'operation'},
          { title: 'Created', field: 'created_at', type: 'datetime', render: data => moment(data.created_at).format('DD-MM-YYYY'), editable: 'never' }
        ],
        data: props.transactions
      },
      cardData: {number: "", expMonth: "", expYear: "", cvc: ""},
      paymentAmount: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.successCreate = this.successCreate.bind(this);
    this.cancelCreate = this.cancelCreate.bind(this);
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  refreshData = async () => {
    try {
      const response = await axios.get('/transactions');
      const labels = [].concat(...response.data.content.map((tx) => moment(tx.created_at).format('DD-MM-YYYY')));
      const series = [].concat(...response.data.content.map((tx) => tx.balance));
      this.setState({ data: {labels: labels, series: [series]}});
    } catch (error) {
      console.error(error);
    }
  };
  refreshTxTableData = async () => {
    try {
      const response = await axios.get('/transactions');
      this.setState(prevState => ({ table: {...prevState.table, data: response.data.content }}));
    } catch (error) {
      console.error(error);
    }
  };
  handleInputChange(event) {
    const eventId = event.target.id
    const eventValue = event.target.value
    if(eventId === 'paymentAmount') {
      this.setState({paymentAmount: eventValue});
    } else {
      this.setState(prevState => ({ cardData: {...prevState.cardData, [eventId]: eventValue }}));
    }
  };
  hideAlert() {
    this.setState({
      alert: null
    });
  };
  inputConfirmAlert(e) {
    this.setState({ alert: e });
    setTimeout(this.inputConfirmAlertNext, 200);
  };
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
          Deposit has been successfully created
        </SweetAlert>
      )
    });
  };
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
          Deposit cannot be created
        </SweetAlert>
      )
    });
  };
  inputAlert(classes) {
    this.setState({
      cardData: {number: "", expMonth: "", expYear: "", cvc: ""},
      paymentAmount: "",
      classes: classes,
      alert: (
        <SweetAlert
          showCancel
          title="Create a card deposit"
          style={{ display: "block", marginTop: "-300px" }}
          onConfirm={e => this.createDeposit()}
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
                    labelText="Number"
                    id="number"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.number,
                      onChange: this.handleInputChange
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={4}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Month"
                    id="expMonth"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.expMonth,
                      onChange: this.handleInputChange
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={4}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Year"
                    id="expYear"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.expYear,
                      onChange: this.handleInputChange
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={4}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="CVC"
                    id="cvc"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.cvc,
                      onChange: this.handleInputChange
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Amount"
                    id="paymentAmount"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.amount,
                      onChange: this.handleInputChange,
                      endAdornment: (<InputAdornment position="end"><AttachMoney/></InputAdornment>)
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
          </form>
        </SweetAlert>
      )
    });
  };
  createDeposit = async () => {
    try {
      const token = await axios.post('/create_card_token', this.state.cardData);
      const paymentData = {
      	"user_id": `${localStorage.getItem('userId')}`,
      	"amount": this.state.paymentAmount,
      	"token": token,
      	"operation": "deposit"
      }
      await axios.post('/wallets', paymentData);
      await this.refreshData();
      await this.refreshTxTableData();
      setTimeout(this.successCreate, 200);
    } catch (error) {
      console.error(error);
      setTimeout(this.cancelCreate, 200);
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.alert}
        <GridContainer>
          <GridItem xs={12} sm={6} md={3} lg={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <AccountBalanceWallet />
                </CardIcon>
                <p className={classes.cardCategory}>Current wallet balance</p>
                <h3 className={classes.cardTitle}>{`$${this.props.wallet.balance}`}</h3>
              </CardHeader>
              <CardFooter/>
            </Card>
            <GridContainer justify="space-between">
              <GridItem xs={12}>
                <Button color="primary" size="lg" onClick={() => this.inputAlert(classes)}>Deposit</Button>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} sm={8} md={6} lg={6}>
            <Card chart className={classes.cardHover}>
              <CardHeader color="info" className={classes.cardHeaderHover}>
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={this.state.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>
              <CardBody>
                <div className={classes.cardHoverUnder}>
                  <Tooltip
                    id="tooltip-top"
                    title="Refresh"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button simple color="info" justIcon>
                      <Refresh className={classes.underChartIcons} onClick={() => this.refreshData()} />
                    </Button>
                  </Tooltip>
                </div>
                <h4 className={classes.cardTitle}>Users Wallet Balance</h4>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="success" icon>
                <CardIcon color="success">
                  <Payment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  All Transactions
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="space-between">
                  <GridItem xs={12} sm={12} md={12}>
                    <MaterialTable
                      style={{boxShadow: "none", border: 0}}
                      title=""
                      columns={this.state.table.columns}
                      data={this.state.table.data}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
