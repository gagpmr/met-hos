import {
  Middle,
  PaddingFourCenter,
  PaddingFourCenterLargeBold,
  WidthTenPaddingFourCenter,
  WidthThreePaddingFourCenterBold
} from "../../../modules/styles";
import { gql, graphql } from "react-apollo";

import ApolloClient from "apollo-client";
import { Link } from "react-router-dom";
import { Loading } from "../shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import RemoveResident from "../shared/RemoveResident.js";

const renderResident = (props, element, index) => {
  if (element) {
    return (
      <tr key={index} className="text-left">
        <td style={PaddingFourCenterBold}>{element.Room.Value}</td>
        <td style={WidthTenPaddingFourCenter}>{element.RollNumber}</td>
        <td style={PaddingFourCenter}>
          <span>
            {element.Name}
            &nbsp;S/o {element.FatherName}
          </span>
        </td>
        <td style={PaddingFourCenter}>{element.Class.Value}</td>
        <td style={WidthThreePaddingFourCenterBold}>
          <Link
            data-toggle="tooltip"
            target="_blank"
            title="Edit Resident"
            to={`/resident/${element._id}`}
          >
            <i className="fa fa-pencil-square-o" />
          </Link>
        </td>
        <td style={WidthThreePaddingFourCenterBold}>
          <RemoveResident
            resident={element}
            fetchAllResidents={props.refetch}
            callingComponent="ResidentsRoomWise"
          />
        </td>
        <td style={WidthThreePaddingFourCenterBold}>
          <Link
            target="_blank"
            data-toggle="tooltip"
            title="Resident Details"
            to={`/resident-details/${element._id}`}
          >
            <i className="fa fa-user-circle" aria-hidden="true" />
          </Link>
        </td>
      </tr>
    );
  }
  return null;
};

const ResidentsRoomWise = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-bordered table-condensed table-striped">
          <thead>
            <tr>
              <th style={PaddingFourCenterLargeBold} colSpan="9">
                Residents &nbsp; &nbsp; Return Amount: &#8377;{" "}
                {props.residentsRoomWise.returnAmount}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.residentsRoomWise.residents.map((element, index) =>
              renderResident(props, element, index)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ResidentsRoomWise.propTypes = {
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  residentsRoomWise: PropTypes.shape({
    returnAmount: PropTypes.number.isRequired,
    residents: PropTypes.array.isRequired
  }),
  client: PropTypes.instanceOf(ApolloClient)
};

const RESIDENTS_ROOM_WISE = gql`
  query {
    residentsRoomWise
  }
`;

export default graphql(RESIDENTS_ROOM_WISE, {
  props: ({ data: { loading, residentsRoomWise, refetch } }) => ({
    loading,
    residentsRoomWise,
    refetch
  }),
  forceFetch: true
})(ResidentsRoomWise);
