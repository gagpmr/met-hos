import {
  Middle,
  WidthSevenPaddingThreeLeft,
  WidthThirteenPaddingThreeLeft,
  h4
} from "../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Link } from "react-router-dom";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";

const renderList = array => (
  <div>
    {array.map(resident => (
      <div key={resident._id} className="row">
        <div className="col-md-12">
          <table className="table table-bordered table-condensed table-striped">
            <thead>
              <tr className="text-left">
                <th colSpan="6">
                  <h4 style={h4}>
                    {resident.Name} S/o {resident.FatherName}
                    &nbsp;{" "}
                    <a href={`/resident/${resident._id}`}>
                      <i className="fa fa-pencil-square-o"> </i>
                    </a>
                  </h4>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-left">
                <td style={WidthSevenPaddingThreeLeft}>Roll No</td>
                <td style={{ padding: 3 }} className="width-thirteen">
                  <a href={`/resident/${resident._id}`}>
                    {resident.RollNumber}
                  </a>
                </td>
                <td style={WidthSevenPaddingThreeLeft}>Tel Num</td>
                <td style={{ padding: 3 }} className="width-twenty-seven">
                  <a href={`/resident/${resident._id}`}>
                    {resident.TelephoneNumber}
                  </a>
                </td>
                <td style={WidthThirteenPaddingThreeLeft}>Category</td>
                <td style={{ padding: 3 }}>
                  <a href={`/resident/${resident._id}`}>
                    {resident.Category.Value}
                  </a>
                </td>
              </tr>
              <tr className="text-left">
                <td style={{ padding: 3 }} className="font-bolder">
                  Room
                </td>
                <td style={{ padding: 3 }}>
                  <a href={`/resident/${resident._id}`}>
                    {resident.Room.Value}
                  </a>
                </td>
                <td style={{ padding: 3 }} className="font-bolder">
                  Class
                </td>
                <td style={{ padding: 3 }} colSpan="5">
                  <a href={`/resident/${resident._id}`}>
                    {resident.Class.Value}
                  </a>
                </td>
              </tr>
              <tr>
                <td
                  style={{ padding: 3 }}
                  colSpan="6"
                  className="text-center bold-black"
                >
                  <Link to={`/resident-details/${resident._id}`}>Details</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
);

export const RoomResidents = ({ array }) => {
  return renderList(array);
};

RoomResidents.propTypes = {
  array: PropTypes.array.isRequired
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
    <RoomResidents
      array={props.roomResidents}
      client={props.client}
      refetch={props.refetch}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  roomResidents: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  roomResidents: []
};

const ROOM_RESIDENTS = gql`
  query($roomId: String!) {
    roomResidents(roomId: $roomId)
  }
`;

export default graphql(ROOM_RESIDENTS, {
  props: ({ data: { loading, roomResidents, refetch } }) => ({
    loading,
    roomResidents,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      roomId: ownProps.match.params.roomId
    }
  })
})(withApollo(FormatData));
