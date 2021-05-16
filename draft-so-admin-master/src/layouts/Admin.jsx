import React from "react";
import cx from "classnames";
import axios from "axios";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";

import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { SnackbarProvider } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';

import routes from "routes.js";

import appStyle from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.jsx";

import defaultImage from "assets/img/default-avatar.png";

var ps

class AdminLayout extends React.Component {
  state = {
    mobileOpen: false,
    miniActive: false,
    image: require("assets/img/sidebar-2.jpg"),
    color: "blue",
    bgColor: "black",
    hasImage: true,
    fixedClasses: "dropdown",
    logo: require("assets/img/logo-white.svg"),
    isDataLoaded: false,
    users: [],
    userData: {},
    gameStyles: [],
    transactions: [],
    wallet: [],
    sports: [],
    configurations: [],
    nflSportId: 0,
    nbaSportId: 0,
    nflGameTypes: [],
    nbaGameTypes: [],
    nflPositions: [],
    nbaPositions: [],
    nflUserGames: [],
    nbaUserGames: [],
    nflGames: [],
    nbaGames: [],
  };
  mainPanel = React.createRef();
  isBase64 = (s) => { // eslint-disable-next-line
    let regex = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i;
    try {
        return !!s.match(regex);
    } catch (err) {
        return false;
    }
  }
  componentDidMount = async () => {
    if(!(localStorage.getItem('token') && localStorage.getItem('userId'))) {
      this.props.history.push('/login');
    }
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
    try {
      const [configurations, users, userRes, gameStyles, gameTypes, sports, wallet, transactions, userGames, positions, nflGamesInCurrentSeason, nbaGamesInCurrentSeason] = await Promise.all([
        axios.get(`/configurations`),
        axios.get(`/users`),
        axios.get(`/users/${localStorage.getItem('userId')}`),
        axios.get('/game_styles'),
        axios.get('/game_types'),
        axios.get('/sports'),
        axios.get(`/wallets/${localStorage.getItem('userId')}`),
        axios.get(`/transactions`),
        axios.get('/all_games'),
        axios.get('/positions'),
        axios.get('nfl/matchups_in_current_season'),
        axios.get('nba/matchups_in_current_season')
      ]);

      const userData = { email: userRes.data.email, firstname: userRes.data.first_name, lastname: userRes.data.last_name, username: userRes.data.username, profile_pic: defaultImage };

      if(userRes.data.profile_pic && userRes.data.profile_pic.length > 0 && this.isBase64(userRes.data.profile_pic)) {
        userData.profile_pic = userRes.data.profile_pic;
      }

      const nflSportId = sports.data.content.find(e => e.slug === 'nfl').id;
      const nbaSportId = sports.data.content.find(e => e.slug === 'nba').id;

      this.setState({
        isDataLoaded: true,
        configurations: configurations.data.content,
        users: users.data.content,
        userData: userData,
        gameStyles: gameStyles.data.content,
        sports: sports.data.content,
        wallet: wallet.data,
        transactions: transactions.data.content,
        nflSportId: nflSportId,
        nbaSportId: nbaSportId,
        nflGameTypes: gameTypes.data.content.filter(e => e.sport_id === nflSportId),
        nbaGameTypes: gameTypes.data.content.filter(e => e.sport_id === nbaSportId),
        nflPositions: positions.data.content.filter(e => e.sport_id === nflSportId),
        nbaPositions: positions.data.content.filter(e => e.sport_id === nbaSportId),
        nflUserGames: userGames.data.content.filter(e => e.sport_id === nflSportId),
        nbaUserGames: userGames.data.content.filter(e => e.sport_id === nbaSportId),
        nflGames: nflGamesInCurrentSeason.data,
        nbaGames: nbaGamesInCurrentSeason.data
      });

    } catch (error) {
      console.error(error.message);
      this.props.history.push('/login');
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.mainPanel.current.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleBgColorClick = bgColor => {
    switch (bgColor) {
      case "white":
        this.setState({ logo: require("assets/img/logo.svg") });
        break;
      default:
        this.setState({ logo: require("assets/img/logo-white.svg") });
        break;
    }
    this.setState({ bgColor: bgColor });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  getActiveRoute = routes => {
    let activeRoute = "DraftShootOut - Admin Panel";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  changeUserData = (user) => {
    this.setState(prevState => ({ userData: {...prevState.userData, email: user.email, firstname: user.first_name, lastname: user.last_name, username: user.username} }));
  };
  changeUserProfilePic = (profile_pic) => {
    this.setState(prevState => ({ userData: {...prevState.userData, profile_pic: profile_pic} }));
  };
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        const ComponentFromRoute = prop.component;
        return (
          <Route
            path={prop.layout + prop.path}
            component={() =>
              <ComponentFromRoute
                users={this.state.users}
                user={this.state.userData}
                transactions={this.state.transactions}
                wallet={this.state.wallet}
                gameStyles={this.state.gameStyles}
                sports={this.state.sports}
                changeUserData={this.changeUserData}
                changeUserProfilePic={this.changeUserProfilePic}
                configurations={this.state.configurations}
                nflSportId={this.state.nflSportId}
                nbaSportId={this.state.nbaSportId}
                nflGameTypes={this.state.nflGameTypes}
                nbaGameTypes={this.state.nbaGameTypes}
                nflPositions={this.state.nflPositions}
                nbaPositions={this.state.nbaPositions}
                nflUserGames={this.state.nflUserGames}
                nbaUserGames={this.state.nbaUserGames}
                nflGames={this.state.nflGames}
                nbaGames={this.state.nbaGames}
              />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  sidebarMinimize = () => {
    this.setState({ miniActive: !this.state.miniActive });
  };
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };
  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    const isDataLoaded = this.state.isDataLoaded;
    return (
      <div>
        <SnackbarProvider maxSnack={4} autoHideDuration={2000} preventDuplicate anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
         <div className={classes.wrapper}>
           {isDataLoaded ? (
             <Sidebar
               routes={routes}
               logoText={"DraftShootOut"}
               logo={this.state.logo}
               image={this.state.image}
               handleDrawerToggle={this.handleDrawerToggle}
               open={this.state.mobileOpen}
               color={this.state.color}
               bgColor={this.state.bgColor}
               miniActive={this.state.miniActive}
               user={this.state.userData}
               {...rest}
             />
           ) : (
            ""
           )}
           <div className={mainPanel} ref={this.mainPanel}>
             {!isDataLoaded ? (
               <GridContainer
                 container
                 spacing={0}
                 direction="column"
                 alignItems="center"
                 justify="center"
                 style={{ minHeight: '100vh' }}
               >
                 <GridItem xs={2}>
                   <CircularProgress />
                 </GridItem>
               </GridContainer>
             ) : (
               <div>
                 <AdminNavbar
                   sidebarMinimize={this.sidebarMinimize.bind(this)}
                   miniActive={this.state.miniActive}
                   brandText={this.getActiveRoute(routes)}
                   handleDrawerToggle={this.handleDrawerToggle}
                   {...rest}
                 />
                 <div className={classes.content}>
                   <div className={classes.container}>
                     <Switch>
                       {this.getRoutes(routes)}
                       <Redirect from="/admin" to="/admin/dashboard" />
                     </Switch>
                   </div>
                 </div>
                 <Footer fluid />
               </div>
             )}
           </div>
         </div>
        </SnackbarProvider>
      </div>
    );
  }
}

AdminLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(AdminLayout);
