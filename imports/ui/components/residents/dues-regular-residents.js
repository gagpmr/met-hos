import {
  Middle,
  PaddingFourCenter,
  PaddingFourCenterBold,
  PaddingFourCenterLargeBold
} from "../../../modules/styles";
import { compose, gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import { Link } from "react-router-dom";
import { Loading } from "../shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

const DUES_LIST_FALSE = gql`
  mutation($id: String!) {
    duesListFalse(id: $id)
  }
`;

const run = (props, e) => {
  e.preventDefault();
  const id = e.currentTarget.dataset.resid;
  props.client
    .mutate({
      mutation: DUES_LIST_FALSE,
      variables: {
        id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.refetch;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
  return true;
};

const NOTICE_LIST_TRUE = gql`
  mutation($resId: String!) {
    noticeListTrue(resId: $resId)
  }
`;

const noticeListAdd = (props, e) => {
  e.preventDefault();
  const resId = e.currentTarget.dataset.resid;
  props.client
    .mutate({
      mutation: NOTICE_LIST_TRUE,
      variables: {
        resId
      }
    })
    .then(() => {
      Bert.alert("Notice List - Resident Added!", "success");
      props.client.resetStore();
      props.refetch;
    })
    .catch(error => {
      Bert.alert(error, "danger");
      console.log("there was an error", error);
    });
  return true;
};

export const DUES_REGULAR_RESIDENTS = gql`
  query {
    duesRegularResidents
  }
`;

const print = (props, e) => {
  e.preventDefault();
  props.client
    .query({
      query: DUES_REGULAR_RESIDENTS
    })
    .then(() => {
      props.history.push(`/dues-regular-print`);
    })
    .catch(error => {
      Bert.alert(error, "danger");
      console.log("there was an error", error);
    });
  return true;
};

const renderDuesTotal = duesTotal => (
  <tr>
    <td style={PaddingFourCenter}>{duesTotal.Room}</td>
    <td style={PaddingFourCenter}>{duesTotal.RollNumber}</td>
    <td style={PaddingFourCenter}>
      <span>{duesTotal.Name}</span>
    </td>
    <td style={PaddingFourCenterBold}>{duesTotal.MessOne}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.MessTwo}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.Canteen}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.Amenity}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.HalfYearlyMc}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.FinesMc}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.TotalMc}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.RoomRent}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.WaterCharges}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.ElectricityCharges}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.HalfYearlyPa}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.Miscellaneous}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.TotalPa}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.Total}</td>
    <td colSpan="4" style={PaddingFourCenterBold} />
  </tr>
);

const refresh = (props, e) => {
  e.preventDefault();
  props.client.resetStore();
  props.refetch;
};

const renderList = props => (
  <div className="row">
    <div className="col-md-12">
      <table className="table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th style={PaddingFourCenterLargeBold} colSpan="24">
              Dues - Regular Residents ({moment().format("DD-MMM-YYYY")}) &nbsp;
              <a onClick={e => print(props, e)} href="">
                <i className="fa fa-print" aria-hidden="true" />
              </a>
              &nbsp;&nbsp;
              <a id="refresh" onClick={e => refresh(props, e)} href="">
                <i className="fa fa-refresh" aria-hidden="true" />
              </a>
            </th>
          </tr>
          <tr>
            <td style={PaddingFourCenterBold}>Room</td>
            <td style={PaddingFourCenterBold}>R.No.</td>
            <td style={PaddingFourCenterBold}>Name</td>
            <td style={PaddingFourCenterBold}>M-1</td>
            <td style={PaddingFourCenterBold}>M-2</td>
            <td style={PaddingFourCenterBold}>CNT</td>
            <td style={PaddingFourCenterBold}>AMNT</td>
            <td style={PaddingFourCenterBold}>HY-MC</td>
            <td style={PaddingFourCenterBold}>MC-Fine</td>
            <td style={PaddingFourCenterBold}>MC-Total</td>
            <td style={PaddingFourCenterBold}>RR</td>
            <td style={PaddingFourCenterBold}>WC</td>
            <td style={PaddingFourCenterBold}>Elec</td>
            <td style={PaddingFourCenterBold}>HY-HST</td>
            <td style={PaddingFourCenterBold}>Misc</td>
            <td style={PaddingFourCenterBold}>HST-Total</td>
            <td style={PaddingFourCenterBold}>Total</td>
            <td colSpan="4" style={PaddingFourCenterBold}>
              Do
            </td>
          </tr>
        </thead>
        <tbody>
          {props.residents.map(resident => (
            <tr key={resident._id}>
              <td style={PaddingFourCenter}>{resident.Room.Value}</td>
              <td style={PaddingFourCenter}>{resident.RollNumber}</td>
              <td style={PaddingFourCenter}>
                <span>{resident.Name}</span>
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidMcTotal.MessOne}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidMcTotal.MessTwo}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidMcTotal.Canteen}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidMcTotal.Amenity}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidMcTotal.HalfYearly}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidMcTotal.MessFine +
                  resident.UnpaidMcTotal.CanteenFine +
                  resident.UnpaidMcTotal.HalfYearlyFine}
              </td>
              <td style={PaddingFourCenterBold}>
                {resident.UnpaidMcTotal.Total}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidPaTotal.RoomRent}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidPaTotal.WaterCharges}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidPaTotal.ElectricityCharges}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidPaTotal.HalfYearly}
              </td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidPaTotal.Miscellaneous}
              </td>
              <td style={PaddingFourCenterBold}>
                {resident.UnpaidPaTotal.Total}
              </td>
              <td style={PaddingFourCenterBold}>{resident.UnpaidTotal}</td>
              <td style={PaddingFourCenterBold}>
                <a id="refresh" onClick={e => refresh(props, e)} href="">
                  <i className="fa fa-refresh" aria-hidden="true" />
                </a>
              </td>
              <td style={PaddingFourCenterBold}>
                <a
                  data-resid={resident._id}
                  onClick={e => run(props, e)}
                  data-toggle="tooltip"
                  title="Remove From Dues List"
                  href=""
                >
                  <i className="fa fa-times" aria-hidden="true" />
                </a>
              </td>
              <td style={PaddingFourCenterBold}>
                <Link
                  target="_blank"
                  to={`/resident-details/${resident._id}`}
                  data-toggle="tooltip"
                  title="Resident Details"
                >
                  <i className="fa fa-user-circle" aria-hidden="true" />
                </Link>
              </td>
              <td style={PaddingFourCenterBold}>
                <a
                  data-resid={resident._id}
                  data-toggle="tooltip"
                  title="Add To Notice List"
                  onClick={e => noticeListAdd(props, e)}
                  href=""
                >
                  <i className="fa fa-list" aria-hidden="true" />
                </a>
              </td>
              <td style={PaddingFourCenterBold}>
                <Link
                  target="_blank"
                  to={`/notice-list`}
                  data-toggle="tooltip"
                  title="View Notice List"
                >
                  <i className="fa fa-eye" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
          {renderDuesTotal(props.duesTotal)}
        </tbody>
      </table>
    </div>
  </div>
);

const DuesRegularResidents = props => {
  return renderList(props);
};

DuesRegularResidents.propTypes = {
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  residents: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Class: PropTypes.shape({
        Value: PropTypes.string.isRequired
      }),
      Room: PropTypes.shape({
        Value: PropTypes.string.isRequired
      }),
      RollNumber: PropTypes.string.isRequired,
      UnpaidMcTotal: PropTypes.object.isRequired,
      UnpaidPaTotal: PropTypes.object.isRequired
    })
  ),
  duesTotal: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <DuesRegularResidents
      loading={props.loading}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
      residents={props.duesRegularResidents.residents}
      duesTotal={props.duesRegularResidents.duesTotal}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  duesRegularResidents: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  duesRegularResidents: {}
};

export default compose(
  graphql(DUES_REGULAR_RESIDENTS, {
    props: ({ data: { loading, duesRegularResidents, refetch } }) => ({
      loading,
      duesRegularResidents,
      refetch
    }),
    forceFetch: true
  })
)(withApollo(FormatData));
