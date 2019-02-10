import {
  Middle,
  PaddingZeroLeft,
  WidthHundredPaddingThree,
  WidthTwentyThreePaddingFourLeftBold
} from "../../../modules/styles";
import { gql, graphql, withApollo } from "react-apollo";

import $ from "jquery";
import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";

const UPDATE_RESIDENT = gql`
  mutation(
    $resId: String
    $name: String!
    $fatherName: String!
    $rollNumber: String!
    $session: String!
    $telephoneNumber: String!
    $category: String!
    $room: String!
    $clas: String!
  ) {
    updateResident(
      resId: $resId
      name: $name
      fatherName: $fatherName
      rollNumber: $rollNumber
      session: $session
      telephoneNumber: $telephoneNumber
      category: $category
      room: $room
      clas: $clas
    )
  }
`;

const ROOM_RESIDENTS = gql`
  query($roomId: String!) {
    roomResidents(roomId: $roomId)
  }
`;

export class Resident extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      room: null,
      category: null,
      clas: null,
      name: null,
      fatherName: null,
      roll: null,
      telephoneNumber: null
    };
    this.saveResident = this.saveResident.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.getClass = this.getClass.bind(this);
    this.getSession = this.getSession.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.getRoom = this.getRoom.bind(this);
    this.getName = this.getName.bind(this);
    this.getFatherName = this.getFatherName.bind(this);
    this.getTelephoneNumber = this.getTelephoneNumber.bind(this);
    this.getRollNumber = this.getRollNumber.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  getClass(e) {
    this.setState({ clas: e.target.value });
  }

  getSession(e) {
    this.setState({ session: e.target.value });
  }

  getCategory(e) {
    this.setState({ category: e.target.value });
  }

  getRoom(e) {
    this.setState({ room: e.target.value });
  }

  getName(e) {
    this.setState({ name: e.target.value });
  }

  getFatherName(e) {
    this.setState({ fatherName: e.target.value });
  }

  getTelephoneNumber(e) {
    this.setState({ telephoneNumber: e.target.value });
  }

  getRollNumber(e) {
    this.setState({ roll: e.target.value });
  }

  handleFocus(e) {
    const target = e.target;
    if (this.props.resident !== undefined) {
      setTimeout(() => {
        target.select();
      }, 0);
    }
  }

  saveResident(e) {
    e.preventDefault();
    const category = $("#category_dd")
      .find(":selected")
      .text();
    const room = $("#room_dd")
      .find(":selected")
      .text();
    const clas = $("#class_dd")
      .find(":selected")
      .text();
    let session = $("#session_dd")
      .find(":selected")
      .text();
    const name = $("#name").val();
    const fatherName = $("#father-name").val();
    const rollNumber = $("#roll-number").val();
    const telephoneNumber = $("#telephone-number").val();
    if (session === "") {
      this.props.sessions.forEach((index, element) => {
        if (element.IsCurrentSession) {
          session = element.Value;
        }
      });
    }
    let resId = "";
    if (this.props.resident._id) {
      resId = this.props.resident._id;
    }
    this.props.client
      .mutate({
        mutation: UPDATE_RESIDENT,
        variables: {
          resId,
          name,
          fatherName,
          rollNumber,
          session,
          telephoneNumber,
          category,
          room,
          clas
        }
      })
      .then(({ data }) => {
        this.props.client.query({
          query: ROOM_RESIDENTS,
          variables: {
            roomId: data.updateResident
          }
        });
        this.props.history.push(`/room-residents/${data.updateResident}`);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.saveResident(event);
    }
  }

  render() {
    if (this.props.loading) {
      return (
        <div style={Middle}>
          <MDSpinner />
        </div>
      );
    }
    const classes = [];
    const categories = [];
    const rooms = [];
    const sessions = [];
    let clas = "";
    let category = "";
    let room = "";
    let session = "";
    let name = "";
    let fatherName = "";
    let roll = "";
    let telephoneNumber = "";
    if (this.props.resident.Name) {
      name = this.props.resident.Name;
      fatherName = this.props.resident.FatherName;
      roll = this.props.resident.RollNumber;
      telephoneNumber = this.props.resident.TelephoneNumber;
      const arr = this.props.resident.RollNumber.split(" (");
      roll = arr[0];
    }
    if (this.props.classes.length > 0) {
      for (let index = 0; index < this.props.classes.length; index++) {
        const element = this.props.classes[index];
        classes.push(
          <option key={element._id} value={element.Value}>
            {element.Value}
          </option>
        );
        if (this.props.resident._id) {
          if (element._id === this.props.resident.Class._id) {
            clas = element.Value;
          }
        }
      }
    }
    if (this.props.categories.length > 0) {
      for (let index = 0; index < this.props.categories.length; index++) {
        const element = this.props.categories[index];
        categories.push(
          <option key={element._id} value={element.Value}>
            {element.Value}
          </option>
        );
        if (this.props.resident._id) {
          if (element.Value === this.props.resident.Category.Value) {
            category = element.Value;
          }
        }
      }
    }
    if (this.props.rooms.length > 0) {
      for (let index = 0; index < this.props.rooms.length; index++) {
        const element = this.props.rooms[index];
        rooms.push(
          <option key={element._id} value={element.Value}>
            {element.Value}
          </option>
        );
        if (this.props.resident._id) {
          if (element.Value === this.props.resident.Room.Value) {
            room = element.Value;
          }
        }
      }
    }
    if (this.props.sessions.length > 0) {
      for (let index = 0; index < this.props.sessions.length; index++) {
        const element = this.props.sessions[index];
        sessions.push(
          <option key={element._id} value={element.Value}>
            {element.Value}
          </option>
        );
        if (this.props.resident._id) {
          if (this.props.resident.RollNumber.includes(element.Suffix)) {
            session = element.Value;
          }
        }
      }
    }
    if (this.state.session !== null) {
      session = this.state.session;
    }
    if (this.state.room !== null) {
      room = this.state.room;
    }
    if (this.state.category !== null) {
      category = this.state.category;
    }
    if (this.state.clas !== null) {
      clas = this.state.clas;
    }
    if (this.state.name !== null) {
      name = this.state.name;
    }
    if (this.state.fatherName !== null) {
      fatherName = this.state.fatherName;
    }
    if (this.state.roll !== null) {
      roll = this.state.roll;
    }
    if (this.state.telephoneNumber !== null) {
      telephoneNumber = this.state.telephoneNumber;
    }
    return (
      <div className="col-md-8 col-md-offset-2">
        <table className="table table-bordered table-condensed table-striped text-center">
          <thead>
            <tr className="text-left">
              <th colSpan="2" className="h4 text-center width-twenty-three">
                <strong>Resident Details</strong>
                &nbsp;
                <a href="/">
                  <i className="fa fa-home" aria-hidden="true" />
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={WidthTwentyThreePaddingFourLeftBold}>Name</td>
              <td style={PaddingZeroLeft}>
                <input
                  onChange={this.getName}
                  onKeyDown={this.keyPressed}
                  onFocus={this.handleFocus}
                  autoFocus
                  type="text"
                  id="name"
                  value={name}
                />
              </td>
            </tr>
            <tr>
              <td style={WidthTwentyThreePaddingFourLeftBold}>Father Name</td>
              <td style={PaddingZeroLeft}>
                <input
                  onChange={this.getFatherName}
                  onKeyDown={this.keyPressed}
                  type="text"
                  id="father-name"
                  value={fatherName}
                />
              </td>
            </tr>
            <tr>
              <td style={WidthTwentyThreePaddingFourLeftBold}>
                Telephone Number
              </td>
              <td style={PaddingZeroLeft}>
                <input
                  onChange={this.getTelephoneNumber}
                  onKeyDown={this.keyPressed}
                  type="text"
                  id="telephone-number"
                  value={telephoneNumber}
                />
              </td>
            </tr>
            <tr>
              <td style={WidthTwentyThreePaddingFourLeftBold}>Roll Number</td>
              <td style={PaddingZeroLeft}>
                <input
                  onChange={this.getRollNumber}
                  onKeyDown={this.keyPressed}
                  type="text"
                  id="roll-number"
                  value={roll}
                />
              </td>
            </tr>
            <tr>
              <td style={WidthTwentyThreePaddingFourLeftBold}>Session</td>
              <td style={PaddingZeroLeft}>
                <select
                  onKeyDown={this.keyPressed}
                  value={session}
                  onChange={this.getSession}
                  id="session_dd"
                  className="width-fifty"
                >
                  {sessions}
                </select>
              </td>
            </tr>
            <tr>
              <td style={WidthTwentyThreePaddingFourLeftBold}>Room Number</td>
              <td style={PaddingZeroLeft}>
                <select
                  onKeyDown={this.keyPressed}
                  value={room}
                  onChange={this.getRoom}
                  id="room_dd"
                  className="width-fifty"
                >
                  {rooms}
                </select>
              </td>
            </tr>
            <tr>
              <td style={WidthTwentyThreePaddingFourLeftBold}>Category</td>
              <td style={PaddingZeroLeft}>
                <select
                  onKeyDown={this.keyPressed}
                  value={category}
                  onChange={this.getCategory}
                  id="category_dd"
                  className="width-fifty"
                >
                  {categories}
                </select>
              </td>
            </tr>
            <tr>
              <td style={WidthTwentyThreePaddingFourLeftBold}>Class</td>
              <td style={PaddingZeroLeft}>
                <select
                  onKeyDown={this.keyPressed}
                  value={clas}
                  onChange={this.getClass}
                  id="class_dd"
                  style={WidthHundredPaddingThree}
                >
                  {classes}
                </select>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="text-center">
                <a onClick={this.saveResident} href="">
                  Save
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Resident.propTypes = {
  loading: PropTypes.bool.isRequired,
  rooms: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  classes: PropTypes.array.isRequired,
  sessions: PropTypes.array.isRequired,
  resident: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
      </div>
    );
  }
  return (
    <Resident
      loading={props.loading}
      rooms={props.editResident.rooms}
      categories={props.editResident.categories}
      classes={props.editResident.classes}
      sessions={props.editResident.sessions}
      resident={props.editResident.resident}
      client={props.client}
      refetch={props.refetch}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  rooms: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  classes: PropTypes.array.isRequired,
  sessions: PropTypes.array.isRequired,
  resident: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  rooms: [],
  categories: [],
  classes: [],
  sessions: [],
  resident: {}
};

const EDIT_RESIDENT = gql`
  query($resId: String) {
    editResident(resId: $resId)
  }
`;

export default graphql(EDIT_RESIDENT, {
  props: ({ data: { loading, editResident, refetch } }) => ({
    loading,
    editResident,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      resId: ownProps.match.params.resId ? ownProps.match.params.resId : ""
    }
  })
})(withRouter(withApollo(FormatData)));
