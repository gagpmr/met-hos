import React from "react";
import PropTypes from "prop-types";
import { gql, withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import ApolloClient from "apollo-client";

const REMOVE_RESIDENT = gql`
  mutation($resId: ID!) {
    removeResident(resId: $resId)
  }
`;

const remove = (props, e) => {
  e.preventDefault();
  const roomId = props.resident.Room._id;
  props.client
    .mutate({
      mutation: REMOVE_RESIDENT,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.client.resetStore();
      if (props.callingComponent === "ResidentDetails") {
        props.history.push(`/room-residents/${roomId}`);
      }
      if (props.callingComponent === "ResidentsRoomWise") {
        props.fetchAllResidents;
      }
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const RemoveResident = props => {
  if (props.callingComponent === "ResidentsRoomWise") {
    return (
      <a
        href=""
        data-toggle="tooltip"
        title="Remove Resident"
        onClick={e => remove(props, e)}
      >
        <i className="fa fa-trash-o" aria-hidden="true" />
      </a>
    );
  } else if (props.callingComponent === "ResidentDetails") {
    return (
      <a
        href=""
        data-toggle="tooltip"
        title="Remove Resident"
        onClick={e => remove(props, e)}
      >
        Delete Resident
      </a>
    );
  }
  return null;
};

RemoveResident.propTypes = {
  resident: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  callingComponent: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  fetchAllResidents: PropTypes.func
};

export default withRouter(withApollo(RemoveResident));
