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
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

class GameStylesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        { title: 'Created', field: 'created_at', type: 'datetime', render: data => data ? moment(data.created_at).format('DD-MM-YYYY') : "", editable: 'never' }
      ],
      data: props.gameStyles
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Game Styles</h4>
            </CardHeader>
            <CardBody>
            <MaterialTable
              style={{boxShadow: "none", border: 0}}
              title=""
              columns={this.state.columns}
              data={this.state.data}
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data;
                        data.push(newData);
                        this.setState({ data }, () => {
                          axios.post('/game_styles', {name: newData.name, description: newData.description});
                          resolve()
                        });
                      }
                      resolve()
                    }, 1000)
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data;
                        const index = data.indexOf(oldData);
                        data[index] = newData;
                        this.setState({ data }, () => {
                          axios.patch(`/game_styles/${oldData.id}`, {name: newData.name, description: newData.description});
                          resolve()
                        });
                      }
                      resolve()
                    }, 1000)
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        let data = this.state.data;
                        const index = data.indexOf(oldData);
                        data.splice(index, 1);
                        this.setState({ data }, () => {
                          axios.delete(`/game_styles/${oldData.id}`);
                          resolve()
                        });
                      }
                      resolve()
                    }, 1000)
                  }),
              }}
            />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

GameStylesPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(GameStylesPage);
