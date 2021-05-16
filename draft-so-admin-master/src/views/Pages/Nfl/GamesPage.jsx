import React from "react";
import axios from "axios";
import moment from 'moment';
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import Assignment from "@material-ui/icons/Assignment";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from '@material-ui/core/Input';
import NavPills from "components/NavPills/NavPills.jsx";
import Badge from "components/Badge/Badge.jsx";

import InputAdornment from "@material-ui/core/InputAdornment";
import Add from '@material-ui/icons/Add';
import SportsFootball from '@material-ui/icons/SportsFootball';
import AttachMoney from '@material-ui/icons/AttachMoney';

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

const formStyles = {...extendedFormsStyle, selectFormControlSelectWithInput: {margin: "18px 0 17px 0 !important"}}

const styles = {...sweetAlertStyle, ...cardStyle, ...formStyles}

const gameTypeSlugMap = {
  all_week: 0,
  mon: 1,
  thu: 2,
  sat: 3,
  sun_eq_10_am: 4,
  sun_gt_1_pm: 5,
  sun: 6
}

class GamesPage extends React.Component {
  constructor(props) {
    super(props);
    const gameStyleInitSelectId = (props.gameStyles.length > 0 && ("id" in props.gameStyles[0])) ? props.gameStyles[0].id : 1;
    const gameTypeInitSelectId = (props.nflGameTypes.length > 0 && ("id" in props.nflGameTypes[0])) ? props.nflGameTypes[0].id : 1;
    this.child = React.createRef();
    this.state = {
      alert: null,
      show: false,
      columns: [
        { title: 'Home Team', field: 'HomeTeam', render: data => data.HomeTeam.toUpperCase() },
        { title: 'Away Team', field: 'AwayTeam', render: data => data.AwayTeam.toUpperCase() },
        { title: 'Week', field: 'Week' },
        { title: 'Season', field: 'Season' },
        { title: 'Date', field: 'Date', type: 'datetime', render: data => moment(data.Date).format('DD-MM-YYYY HH:mm:ss'), editable: 'never' }
      ],
      detailsColumns: [
        { title: 'Home Team', field: 'home_team', render: data => data.home_team.toUpperCase() },
        { title: 'Away Team', field: 'away_team', render: data => data.away_team.toUpperCase() },
        { title: 'Week', field: 'week' },
        { title: 'Season', field: 'season' },
        { title: 'Date', field: 'date', type: 'datetime', render: data => moment(data.date).format('DD-MM-YYYY HH:mm:ss'), editable: 'never' }
      ],
      userGamesColumns: [
        { title: 'Game Style', field: 'game_style_name' },
        { title: 'Name', field: 'name' },
        { title: 'Entry', field: 'entry' },
        { title: 'Prize Pool', field: 'prize_pool' },
        { title: 'Min No. of Players', field: 'min_number_of_players' },
        { title: 'No. of Players', field: 'number_of_players' },
        { title: 'Has Started?', field: 'is_started', type: 'boolean', editable: 'never' },
        { title: 'Has Finished?', field: 'is_finished', type: 'boolean', editable: 'never' },
        { title: 'Date Start', field: 'date_start', type: 'datetime', render: data => data.date_start ? moment(data.date_start).format('DD-MM-YYYY HH:mm:ss') : "", editable: 'never' },
        { title: 'Date End', field: 'date_end', type: 'datetime', render: data => data.date_end ? moment(data.date_end).format('DD-MM-YYYY HH:mm:ss') : "", editable: 'never' },
        { title: 'Created', field: 'created_at', type: 'datetime', render: data => moment(data.created_at).format('DD-MM-YYYY HH:mm:ss'), editable: 'never' }
      ],
      data: props.nflGames,
      sportId: props.nflSportId,
      userGamesData: props.nflUserGames,
      gameStyles: props.gameStyles,
      gameTypes: props.nflGameTypes,
      form: { name: "", entry: "", prizePool: "", userJoinCap: "" },
      selectedGameStyle: gameStyleInitSelectId,
      selectedGameType: gameTypeInitSelectId,
      selectedGameCnt: 0,
      selectedNoOfWinners: 1,
      rowData: "",
      classes: "",
      all_week: [],
      mon: [],
      thu: [],
      sat: [],
      sun: [],
      sun_eq_10_am: [],
      sun_gt_1_pm: [],
      u_all_week: [],
      u_mon: [],
      u_thu: [],
      u_sat: [],
      u_sun: [],
      u_sun_eq_10_am: [],
      u_sun_gt_1_pm: [],
      game_type_id_slug: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSelectGameTypeChange = this.handleSelectGameTypeChange.bind(this);
    this.handleSelectNoOfWinnersChange = this.handleSelectNoOfWinnersChange.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.successMessagePopup = this.successMessagePopup.bind(this);
    this.cancelMessagePopup = this.cancelMessagePopup.bind(this);
    this.warningMessagePopupTitleOnly = this.warningMessagePopupTitleOnly.bind(this);
  }
  handleChange(event) {
    const eventId = event.target.id;
    const eventValue = event.target.value;
    this.setState(prevState => ({ form: {...prevState.form, [eventId]: eventValue }}));
  }
  handleSelectChange(event) {
    const eventValue = event.target.value;
    this.inputAlert(this.state.classes, Number(eventValue), this.state.selectedGameType, this.state.selectedNoOfWinners);
  }
  handleSelectGameTypeChange(event) {
    const eventValue = event.target.value;
    this.inputAlert(this.state.classes, this.state.selectedGameStyle, Number(eventValue), this.state.selectedNoOfWinners);
  }
  handleSelectNoOfWinnersChange(event) {
    const eventValue = event.target.value;
    this.inputAlert(this.state.classes, this.state.selectedGameStyle, this.state.selectedGameType, Number(eventValue));
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
  successMessagePopup(message) {
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
          {message}
        </SweetAlert>
      )
    });
  }
  cancelMessagePopup(message) {
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
  warningMessagePopupTitleOnly(message) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-300px" }}
          title={message}
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
        </SweetAlert>
      )
    });
  }
  renderOptions() {
     return this.state.gameStyles.map((o, i) => {
       return (
         <option value={o.id} key={i}>{o.name}</option>
       );
     });
  }
  renderOptionsForGameTypes() {
     return this.state.gameTypes.map((o, i) => {
       return (
         <option value={o.id} key={i}>{o.name}</option>
       );
     });
  }
  inputAlert(classes, selectedGameStyle, selectedGameType, selectedNoOfWinners) {
    this.setState({
      selectedGameStyle: selectedGameStyle,
      selectedGameType: selectedGameType,
      selectedNoOfWinners: selectedNoOfWinners,
      classes: classes,
      alert: (
        <SweetAlert
          showCancel
          title="Create a game"
          style={{ display: "block", marginTop: "-300px" }}
          onConfirm={e => this.createGame()}
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
                    labelText="Name"
                    id="name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.name,
                      onChange: this.handleChange
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="gameTypes">Game Type</InputLabel>
                  <Select
                      native
                      value={selectedGameType}
                      onChange={this.handleSelectGameTypeChange}
                      input={<Input id="gameTypes" />}
                    >
                    {this.renderOptionsForGameTypes()}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="gameStyles">Game Style</InputLabel>
                  <Select
                      native
                      value={selectedGameStyle}
                      onChange={this.handleSelectChange}
                      input={<Input id="gameStyles" />}
                    >
                    {this.renderOptions()}
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Entry"
                    id="entry"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.entry,
                      onChange: this.handleChange,
                      endAdornment: (<InputAdornment position="end"><AttachMoney/></InputAdornment>)
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="Prize Pool"
                    id="prizePool"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.prizePool,
                      onChange: this.handleChange,
                      endAdornment: (<InputAdornment position="end"><AttachMoney/></InputAdornment>)
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControlSelectWithInput}>
                  <InputLabel htmlFor="noOfWinners">No. Of Winners</InputLabel>
                  <Select
                      native
                      value={selectedNoOfWinners}
                      onChange={this.handleSelectNoOfWinnersChange}
                      input={<Input id="noOfWinners" />}
                    >
                    <option value="1" key="1">1</option>
                    <option value="3" key="3">3</option>
                    <option value="5" key="5">5</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <CustomInput
                    labelText="User Join Cap"
                    id="userJoinCap"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      value: this.state.userJoinCap,
                      onChange: this.handleChange
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
  createGame = async () => {
    try {
      if(!this.state.form.name) {
        return setTimeout(this.cancelMessagePopup("Name cannot be empty"), 200);
      }
      const gameData = {
        sport_id: this.state.sportId,
        game_style_id: this.state.selectedGameStyle,
        game_type_id: this.state.selectedGameType,
        name: this.state.form.name,
        entry: this.state.form.entry,
        prize_pool: this.state.form.prizePool,
        number_of_winners: this.state.selectedNoOfWinners,
        user_join_cap: this.state.form.userJoinCap,
        is_favourite: 0
      }
      await axios.post('/games', gameData);
      setTimeout(this.successMessagePopup("Game has been successfully created"), 200);
      await this.refreshUserGamesData();
    } catch (error) {
      console.error(error);
      setTimeout(this.cancelMessagePopup("Given game already exists, please edit or delete already created one"), 200);
    }
  }
  addMatchupToGame = async (rowData) => {
    if(this.state.selectedGameCnt) {
      try {
        const matchupData = {
          game_id: this.state.selectedGameCnt,
          home_team: rowData.HomeTeam,
          away_team: rowData.AwayTeam,
          season: rowData.Season,
          week: rowData.Week,
          game_key: rowData.GameKey,
          score_id: rowData.ScoreID,
          date: rowData.Date,
          game_type_category: rowData.GameTypeCategory
        }
        await axios.post('/nfl/matchups', matchupData);
        setTimeout(this.successMessagePopup("Matchup has been successfully added to a game"), 200);
        await this.refreshUserGamesData();
      } catch (error) {
        console.error(error);
        setTimeout(this.cancelMessagePopup(error.response.data.error), 200);
      }
    } else {
      setTimeout(this.warningMessagePopupTitleOnly("Please select a game"), 200);
    }
  }
  refreshData = async () => {
    try {
      const response = await axios.get('/nfl/matchups_in_current_season');
      this.setState({ data: response.data });
      this.clasifyGamesByType();
    } catch (error) {
      console.error(error);
    }
  }
  refreshUserGamesData = async () => {
    try {
      const response = await axios.get('/all_games');
      this.setState({ userGamesData: response.data.content.filter(e => e.sport_id === this.state.sportId) });
      this.clasifyGamesByType();
    } catch (error) {
      console.error(error);
    }
  }
  clasifyGamesByType = () => {
    const all_week = [];
    const mon = [];
    const thu = [];
    const sat = [];
    const sun = [];
    const sun_eq_10_am = [];
    const sun_gt_1_pm = [];

    const u_all_week = [];
    const u_mon = [];
    const u_thu = [];
    const u_sat = [];
    const u_sun = [];
    const u_sun_eq_10_am = [];
    const u_sun_gt_1_pm = [];
    const game_type_id_slug = {};

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const categorizedGameData = this.state.data.map((item, i) => {
      let d = new Date(item.Date);
      let dayName = days[d.getDay()];
      let time = d.getHours();
      all_week.push({...item, GameTypeCategory: 'all_week'});
      switch(dayName) {
        case 'Sunday':
          if(time < 13) {
            sun_eq_10_am.push({...item, GameTypeCategory: 'sun_eq_10_am'});
            sun.push({...item, GameTypeCategory: 'sun_eq_10_am'});
          } else if(time >= 13) {
            sun_gt_1_pm.push({...item, GameTypeCategory: 'sun_gt_1_pm'});
            sun.push({...item, GameTypeCategory: 'sun_gt_1_pm'});
          }
        break;
        case 'Monday':
          mon.push({...item, GameTypeCategory: 'mon'});
        break;
        case 'Thursday':
          thu.push({...item, GameTypeCategory: 'thu'});
        break;
        case 'Saturday':
          sat.push({...item, GameTypeCategory: 'sat'});
        break;
      }
      return item;
    })

    this.state.userGamesData.map((item, i) => {
      eval(`u_${item.game_type_slug}`).push(item);
      if(item.id && item.game_type_slug) {
        game_type_id_slug[item.id] = item.game_type_slug;
      }
    })

    this.setState({
      data: categorizedGameData,
      all_week: all_week,
      mon: mon,
      thu: thu,
      sat: sat,
      sun: sun,
      sun_eq_10_am: sun_eq_10_am,
      sun_gt_1_pm: sun_gt_1_pm,
      u_all_week: u_all_week,
      u_mon: u_mon,
      u_thu: u_thu,
      u_sat: u_sat,
      u_sun: u_sun,
      u_sun_eq_10_am: u_sun_eq_10_am,
      u_sun_gt_1_pm: u_sun_gt_1_pm,
      game_type_id_slug: game_type_id_slug
    });
  }
  handleGameCntSelect = event => {
    const game_type_selected_slug = this.state.game_type_id_slug[event.target.value];
    const game_type_index = gameTypeSlugMap[game_type_selected_slug];
    this.child.current.handleChangeIndex(game_type_index);
    this.setState({ selectedGameCnt: event.target.value });
  };
  renderUserGamesOptions = (classes) => {
    return this.state.userGamesData.map((o, i) => {
      return (
        <MenuItem
          key={i}
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          value={o.id}
          gametypeslug={o.game_type_slug}
        >
          <span>{o.name} <Badge color="warning">{o.game_type_name}</Badge></span>
        </MenuItem>
      );
    });
  }
  componentDidMount() {
    this.clasifyGamesByType();
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
                  <SportsFootball />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>NFL</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={6} md={6}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Choose Game
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={this.state.selectedGameCnt}
                        onChange={this.handleGameCntSelect}
                        inputProps={{
                          name: "gameCntSelect",
                          id: "gameCntSelect"
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          Choose Game
                        </MenuItem>
                        {this.renderUserGamesOptions(classes)}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    <Button round color="primary" style={{ marginTop: "25px" }} onClick={(event) => this.inputAlert(classes, this.state.selectedGameStyle, this.state.selectedGameType, this.state.selectedNoOfWinners)}><Add /> Create a new game</Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <NavPills
              ref={this.child}
              color="warning"
              alignCenter
              tabs={[
                {
                  tabButton: "All week",
                  tabContent: (
                    <div>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>Matchups in the current season</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.columns}
                          data={this.state.all_week}
                          actions={[
                            {
                              icon: 'add',
                              tooltip: 'Create a game',
                              onClick: (event, rowData) => this.addMatchupToGame(rowData)
                            },
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshData()
                            }
                          ]}
                        />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>User Games</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.userGamesColumns}
                          data={this.state.u_all_week}
                          actions={[
                            // {
                            //   icon: 'star',
                            //   tooltip: 'Set game favourite',
                            //   isFreeAction: true,
                            //   onClick: () => this.setGameFavourite()
                            // },
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshUserGamesData()
                            }
                          ]}
                          editable={{
                            onRowDelete: oldUserGamesData =>
                              new Promise((resolve, reject) => {
                                setTimeout(() => {
                                  {
                                    let userGamesData = this.state.userGamesData;
                                    const index = userGamesData.indexOf(oldUserGamesData);
                                    userGamesData.splice(index, 1);
                                    this.setState({ userGamesData }, async () => {
                                      await axios.delete(`/games/${oldUserGamesData.id}`);
                                      await this.refreshUserGamesData();
                                      resolve()
                                    });
                                  }
                                  resolve()
                                }, 1000)
                              }),
                          }}
                          detailPanel={rowData => {
                            return (
                              <MaterialTable
                                style={{boxShadow: "none", border: 0}}
                                title=""
                                options={{ search: false }}
                                columns={this.state.detailsColumns}
                                data={query =>
                                  new Promise((resolve, reject) => {
                                    axios.get(`/nfl/matchups/${rowData.id}`).then(function (response) {
                                      const dataStart = query.page > 0 ? query.page*query.pageSize : query.page;
                                      resolve({
                                        data: response.data.content.slice(dataStart, (dataStart+query.pageSize)),
                                        page: query.page,
                                        totalCount: response.data.content.length
                                      })
                                    })
                                  })
                                }
                              />
                            )
                          }}
                          onRowClick={(event, rowData, togglePanel) => togglePanel()}
                        />
                        </CardBody>
                      </Card>
                    </div>
                  )
                },
                {
                  tabButton: "Monday only",
                  tabContent: (
                    <div>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>Matchups in the current season</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.columns}
                          data={this.state.mon}
                          actions={[
                            {
                              icon: 'add',
                              tooltip: 'Create a game',
                              onClick: (event, rowData) => this.addMatchupToGame(rowData)
                            },
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshData()
                            }
                          ]}
                        />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>User Games</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.userGamesColumns}
                          data={this.state.u_mon}
                          actions={[
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshUserGamesData()
                            }
                          ]}
                          editable={{
                            onRowDelete: oldUserGamesData =>
                              new Promise((resolve, reject) => {
                                setTimeout(() => {
                                  {
                                    let userGamesData = this.state.userGamesData;
                                    const index = userGamesData.indexOf(oldUserGamesData);
                                    userGamesData.splice(index, 1);
                                    this.setState({ userGamesData }, async () => {
                                      await axios.delete(`/games/${oldUserGamesData.id}`);
                                      await this.refreshUserGamesData();
                                      resolve()
                                    });
                                  }
                                  resolve()
                                }, 1000)
                              }),
                          }}
                          detailPanel={rowData => {
                            return (
                              <MaterialTable
                                style={{boxShadow: "none", border: 0}}
                                title=""
                                options={{ search: false }}
                                columns={this.state.detailsColumns}
                                data={query =>
                                  new Promise((resolve, reject) => {
                                    axios.get(`/nfl/matchups/${rowData.id}`).then(function (response) {
                                      const dataStart = query.page > 0 ? query.page*query.pageSize : query.page;
                                      resolve({
                                        data: response.data.content.slice(dataStart, (dataStart+query.pageSize)),
                                        page: query.page,
                                        totalCount: response.data.content.length
                                      })
                                    })
                                  })
                                }
                              />
                            )
                          }}
                          onRowClick={(event, rowData, togglePanel) => togglePanel()}
                        />
                        </CardBody>
                      </Card>
                    </div>
                  )
                },
                {
                  tabButton: "Thursday only",
                  tabContent: (
                    <div>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>Matchups in the current season</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.columns}
                          data={this.state.thu}
                          actions={[
                            {
                              icon: 'add',
                              tooltip: 'Create a game',
                              onClick: (event, rowData) => this.addMatchupToGame(rowData)
                            },
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshData()
                            }
                          ]}
                        />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>User Games</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.userGamesColumns}
                          data={this.state.u_thu}
                          actions={[
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshUserGamesData()
                            }
                          ]}
                          editable={{
                            onRowDelete: oldUserGamesData =>
                              new Promise((resolve, reject) => {
                                setTimeout(() => {
                                  {
                                    let userGamesData = this.state.userGamesData;
                                    const index = userGamesData.indexOf(oldUserGamesData);
                                    userGamesData.splice(index, 1);
                                    this.setState({ userGamesData }, async () => {
                                      await axios.delete(`/games/${oldUserGamesData.id}`);
                                      await this.refreshUserGamesData();
                                      resolve()
                                    });
                                  }
                                  resolve()
                                }, 1000)
                              }),
                          }}
                          detailPanel={rowData => {
                            return (
                              <MaterialTable
                                style={{boxShadow: "none", border: 0}}
                                title=""
                                options={{ search: false }}
                                columns={this.state.detailsColumns}
                                data={query =>
                                  new Promise((resolve, reject) => {
                                    axios.get(`/nfl/matchups/${rowData.id}`).then(function (response) {
                                      const dataStart = query.page > 0 ? query.page*query.pageSize : query.page;
                                      resolve({
                                        data: response.data.content.slice(dataStart, (dataStart+query.pageSize)),
                                        page: query.page,
                                        totalCount: response.data.content.length
                                      })
                                    })
                                  })
                                }
                              />
                            )
                          }}
                          onRowClick={(event, rowData, togglePanel) => togglePanel()}
                        />
                        </CardBody>
                      </Card>
                    </div>
                  )
                },
                {
                  tabButton: "Saturday only",
                  tabContent: (
                    <div>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>Matchups in the current season</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.columns}
                          data={this.state.sat}
                          actions={[
                            {
                              icon: 'add',
                              tooltip: 'Create a game',
                              onClick: (event, rowData) => this.addMatchupToGame(rowData)
                            },
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshData()
                            }
                          ]}
                        />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>User Games</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.userGamesColumns}
                          data={this.state.u_sat}
                          actions={[
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshUserGamesData()
                            }
                          ]}
                          editable={{
                            onRowDelete: oldUserGamesData =>
                              new Promise((resolve, reject) => {
                                setTimeout(() => {
                                  {
                                    let userGamesData = this.state.userGamesData;
                                    const index = userGamesData.indexOf(oldUserGamesData);
                                    userGamesData.splice(index, 1);
                                    this.setState({ userGamesData }, async () => {
                                      await axios.delete(`/games/${oldUserGamesData.id}`);
                                      await this.refreshUserGamesData();
                                      resolve()
                                    });
                                  }
                                  resolve()
                                }, 1000)
                              }),
                          }}
                          detailPanel={rowData => {
                            return (
                              <MaterialTable
                                style={{boxShadow: "none", border: 0}}
                                title=""
                                options={{ search: false }}
                                columns={this.state.detailsColumns}
                                data={query =>
                                  new Promise((resolve, reject) => {
                                    axios.get(`/nfl/matchups/${rowData.id}`).then(function (response) {
                                      const dataStart = query.page > 0 ? query.page*query.pageSize : query.page;
                                      resolve({
                                        data: response.data.content.slice(dataStart, (dataStart+query.pageSize)),
                                        page: query.page,
                                        totalCount: response.data.content.length
                                      })
                                    })
                                  })
                                }
                              />
                            )
                          }}
                          onRowClick={(event, rowData, togglePanel) => togglePanel()}
                        />
                        </CardBody>
                      </Card>
                    </div>
                  )
                },
                {
                  tabButton: "Sunday morning",
                  tabContent: (
                    <div>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>Matchups in the current season</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.columns}
                          data={this.state.sun_eq_10_am}
                          actions={[
                            {
                              icon: 'add',
                              tooltip: 'Create a game',
                              onClick: (event, rowData) => this.addMatchupToGame(rowData)
                            },
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshData()
                            }
                          ]}
                        />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>User Games</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.userGamesColumns}
                          data={this.state.u_sun_eq_10_am}
                          actions={[
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshUserGamesData()
                            }
                          ]}
                          editable={{
                            onRowDelete: oldUserGamesData =>
                              new Promise((resolve, reject) => {
                                setTimeout(() => {
                                  {
                                    let userGamesData = this.state.userGamesData;
                                    const index = userGamesData.indexOf(oldUserGamesData);
                                    userGamesData.splice(index, 1);
                                    this.setState({ userGamesData }, async () => {
                                      await axios.delete(`/games/${oldUserGamesData.id}`);
                                      await this.refreshUserGamesData();
                                      resolve()
                                    });
                                  }
                                  resolve()
                                }, 1000)
                              }),
                          }}
                          detailPanel={rowData => {
                            return (
                              <MaterialTable
                                style={{boxShadow: "none", border: 0}}
                                title=""
                                options={{ search: false }}
                                columns={this.state.detailsColumns}
                                data={query =>
                                  new Promise((resolve, reject) => {
                                    axios.get(`/nfl/matchups/${rowData.id}`).then(function (response) {
                                      const dataStart = query.page > 0 ? query.page*query.pageSize : query.page;
                                      resolve({
                                        data: response.data.content.slice(dataStart, (dataStart+query.pageSize)),
                                        page: query.page,
                                        totalCount: response.data.content.length
                                      })
                                    })
                                  })
                                }
                              />
                            )
                          }}
                          onRowClick={(event, rowData, togglePanel) => togglePanel()}
                        />
                        </CardBody>
                      </Card>
                    </div>
                  )
                },
                {
                  tabButton: "Sunday afternoon/evening",
                  tabContent: (
                    <div>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>Matchups in the current season</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.columns}
                          data={this.state.sun_gt_1_pm}
                          actions={[
                            {
                              icon: 'add',
                              tooltip: 'Create a game',
                              onClick: (event, rowData) => this.addMatchupToGame(rowData)
                            },
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshData()
                            }
                          ]}
                        />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>User Games</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.userGamesColumns}
                          data={this.state.u_sun_gt_1_pm}
                          actions={[
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshUserGamesData()
                            }
                          ]}
                          editable={{
                            onRowDelete: oldUserGamesData =>
                              new Promise((resolve, reject) => {
                                setTimeout(() => {
                                  {
                                    let userGamesData = this.state.userGamesData;
                                    const index = userGamesData.indexOf(oldUserGamesData);
                                    userGamesData.splice(index, 1);
                                    this.setState({ userGamesData }, async () => {
                                      await axios.delete(`/games/${oldUserGamesData.id}`);
                                      await this.refreshUserGamesData();
                                      resolve()
                                    });
                                  }
                                  resolve()
                                }, 1000)
                              }),
                          }}
                          detailPanel={rowData => {
                            return (
                              <MaterialTable
                                style={{boxShadow: "none", border: 0}}
                                title=""
                                options={{ search: false }}
                                columns={this.state.detailsColumns}
                                data={query =>
                                  new Promise((resolve, reject) => {
                                    axios.get(`/nfl/matchups/${rowData.id}`).then(function (response) {
                                      const dataStart = query.page > 0 ? query.page*query.pageSize : query.page;
                                      resolve({
                                        data: response.data.content.slice(dataStart, (dataStart+query.pageSize)),
                                        page: query.page,
                                        totalCount: response.data.content.length
                                      })
                                    })
                                  })
                                }
                              />
                            )
                          }}
                          onRowClick={(event, rowData, togglePanel) => togglePanel()}
                        />
                        </CardBody>
                      </Card>
                    </div>
                  )
                },
                {
                  tabButton: "Sunday all day",
                  tabContent: (
                    <div>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>Matchups in the current season</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.columns}
                          data={this.state.sun}
                          actions={[
                            {
                              icon: 'add',
                              tooltip: 'Create a game',
                              onClick: (event, rowData) => this.addMatchupToGame(rowData)
                            },
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshData()
                            }
                          ]}
                        />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardHeader color="primary" icon>
                          <CardIcon color="primary">
                            <Assignment />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>User Games</h4>
                        </CardHeader>
                        <CardBody>
                        <MaterialTable
                          style={{boxShadow: "none", border: 0}}
                          title=""
                          columns={this.state.userGamesColumns}
                          data={this.state.u_sun}
                          actions={[
                            {
                              icon: 'refresh',
                              tooltip: 'Refresh Data',
                              isFreeAction: true,
                              onClick: () => this.refreshUserGamesData()
                            }
                          ]}
                          editable={{
                            onRowDelete: oldUserGamesData =>
                              new Promise((resolve, reject) => {
                                setTimeout(() => {
                                  {
                                    let userGamesData = this.state.userGamesData;
                                    const index = userGamesData.indexOf(oldUserGamesData);
                                    userGamesData.splice(index, 1);
                                    this.setState({ userGamesData }, async () => {
                                      await axios.delete(`/games/${oldUserGamesData.id}`);
                                      await this.refreshUserGamesData();
                                      resolve()
                                    });
                                  }
                                  resolve()
                                }, 1000)
                              }),
                          }}
                          detailPanel={rowData => {
                            return (
                              <MaterialTable
                                style={{boxShadow: "none", border: 0}}
                                title=""
                                options={{ search: false }}
                                columns={this.state.detailsColumns}
                                data={query =>
                                  new Promise((resolve, reject) => {
                                    axios.get(`/nfl/matchups/${rowData.id}`).then(function (response) {
                                      const dataStart = query.page > 0 ? query.page*query.pageSize : query.page;
                                      resolve({
                                        data: response.data.content.slice(dataStart, (dataStart+query.pageSize)),
                                        page: query.page,
                                        totalCount: response.data.content.length
                                      })
                                    })
                                  })
                                }
                              />
                            )
                          }}
                          onRowClick={(event, rowData, togglePanel) => togglePanel()}
                        />
                        </CardBody>
                      </Card>
                    </div>
                  )
                }
              ]}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

GamesPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(GamesPage);
