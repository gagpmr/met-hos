import { Middle, h4 } from "../../../modules/styles";
import React, { useEffect, useState } from "react";
import { changeDate, handleChange, keyPressed } from "../shared/Functions";

import ApolloClient from "apollo-client";
import DatePicker from "react-datepicker";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import moment from "moment";
import { withRouter } from "react-router-dom";

const UPDATE_SA_DETAIL = gql`
  mutation(
    $detId: ID!
    $receiptDate: String!
    $depositDate: String!
    $receiptNumber: Int!
    $studentName: String!
    $roomNumber: String!
    $rollNumber: String!
    $hostelSecurity: Int!
    $messSecurity: Int!
    $canteenSecurity: Int!
  ) {
    updateSaDetail(
      detId: $detId
      receiptDate: $receiptDate
      depositDate: $depositDate
      receiptNumber: $receiptNumber
      studentName: $studentName
      roomNumber: $roomNumber
      rollNumber: $rollNumber
      hostelSecurity: $hostelSecurity
      messSecurity: $messSecurity
      canteenSecurity: $canteenSecurity
    )
  }
`;

const EDIT_SA_DETAIL = gql`
  query($detId: String!) {
    editSaDetail(detId: $detId)
  }
`;

const SA_DATE_DETAILS = gql`
  query($date: String!) {
    saDateDetails(date: $date)
  }
`;

const STATE = gql`
  query {
    editSaDetail_ReceiptDate
    editSaDetail_DepositDate
    editSaDetail_ReceiptNumber
    editSaDetail_StudentName
    editSaDetail_CanteenSecurity
    editSaDetail_MessSecurity
    editSaDetail_HostelSecurity
    editSaDetail_RollNumber
    editSaDetail_RoomNumber
    editSaDetail_id
  }
`;

const submit = (e, client, history) => {
  e.preventDefault();
  const state = client.readQuery({
    query: STATE
  });
  const depositDate = state.editSaDetail_DepositDate;
  client
    .mutate({
      mutation: UPDATE_SA_DETAIL,
      variables: {
        depositDate,
        detId: state.editSaDetail_id,
        receiptDate: state.editSaDetail_ReceiptDate,
        receiptNumber: state.editSaDetail_ReceiptNumber,
        studentName: state.editSaDetail_StudentName,
        roomNumber: state.editSaDetail_RoomNumber,
        rollNumber: state.editSaDetail_RollNumber,
        hostelSecurity: state.editSaDetail_HostelSecurity,
        messSecurity: state.editSaDetail_MessSecurity,
        canteenSecurity: state.editSaDetail_CanteenSecurity
      }
    })
    .then(() => {
      client.resetStore().then(() => {
        client
          .query({
            query: SA_DATE_DETAILS,
            variables: {
              date: depositDate
            }
          })
          .then(() => {
            history.push(`/sa-date-details/${depositDate}`);
          });
      });
    });
};

const EditSaDetail = ({ state, client, history }) => {
  const [receiptDate, setReceiptDate] = useState(moment.utc(state.editSaDetail_ReceiptDate, "DD-MM-YYYY").toDate());
  useEffect(() => changeDate(receiptDate, client, "editSaDetail_ReceiptDate"));
  const [depositDate, setDepositDate] = useState(moment.utc(state.editSaDetail_DepositDate, "DD-MM-YYYY").toDate());
  useEffect(() => changeDate(depositDate, client, "editSaDetail_DepositDate"));
  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <table className="table table-bordered table-condensed table-striped text-center">
          <thead>
            <tr>
              <th colSpan="2">
                <h4 style={h4}>Edit Security Account Detail</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-center width-fifty">Receipt Date</th>
              <td
                style={{
                  paddingLeft: 51,
                  paddingRight: 51
                }}
                className="text-center"
              >
                <DatePicker
                  tabIndex={0}
                  dateFormat="dd-MM-yyyy"
                  onChange={date => setReceiptDate(date)}
                  selected={receiptDate}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center width-fifty">Deposit Date</th>
              <td
                style={{
                  paddingLeft: 51,
                  paddingRight: 51
                }}
                className="text-center"
              >
                <DatePicker
                  tabIndex={0}
                  dateFormat="dd-MM-yyyy"
                  onChange={date => setDepositDate(date)}
                  selected={depositDate}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center width-fifty">Receipt Number</th>
              <td className="text-center">
                <input
                  type="text"
                  tabIndex="0"
                  name="editSaDetail_ReceiptNumber"
                  defaultValue={state.editSaDetail_ReceiptNumber}
                  onChange={e => handleChange(e, client)}
                  onKeyDown={e => keyPressed(e, client, history, submit)}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center">Student Name</th>
              <td className="text-center">
                <input
                  type="text"
                  tabIndex="0"
                  name="editSaDetail_StudentName"
                  defaultValue={state.editSaDetail_StudentName}
                  onChange={e => handleChange(e, client)}
                  onKeyDown={e => keyPressed(e, client, history, submit)}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center">Room Number</th>
              <td className="text-center">
                <input
                  type="text"
                  tabIndex="0"
                  name="editSaDetail_RoomNumber"
                  defaultValue={state.editSaDetail_RoomNumber}
                  onChange={e => handleChange(e, client)}
                  onKeyDown={e => keyPressed(e, client, history, submit)}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center">Roll Number</th>
              <td className="text-center">
                <input
                  type="text"
                  tabIndex="0"
                  name="editSaDetail_RollNumber"
                  defaultValue={state.editSaDetail_RollNumber}
                  onChange={e => handleChange(e, client)}
                  onKeyDown={e => keyPressed(e, client, history, submit)}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center">Hostel Security</th>
              <td className="text-center">
                <input
                  type="text"
                  tabIndex="0"
                  name="editSaDetail_HostelSecurity"
                  defaultValue={state.editSaDetail_HostelSecurity}
                  onChange={e => handleChange(e, client)}
                  onKeyDown={e => keyPressed(e, client, history, submit)}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center">Mess Security</th>
              <td className="text-center">
                <input
                  type="text"
                  tabIndex="0"
                  name="editSaDetail_MessSecurity"
                  defaultValue={state.editSaDetail_MessSecurity}
                  onChange={e => handleChange(e, client)}
                  onKeyDown={e => keyPressed(e, client, history, submit)}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center">Canteen Security</th>
              <td className="text-center">
                <input
                  type="text"
                  tabIndex="0"
                  name="editSaDetail_CanteenSecurity"
                  defaultValue={state.editSaDetail_CanteenSecurity}
                  onChange={e => handleChange(e, client)}
                  onKeyDown={e => keyPressed(e, client, history, submit)}
                />
              </td>
            </tr>
            <tr>
              <th className="text-center" colSpan="2">
                <a id="save-form" onClick={e => submit(e, client, history)} href="">
                  Save
                </a>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

EditSaDetail.propTypes = {
  state: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

const FormatData = ({ loading, client, editSaDetail, history }) => {
  if (loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
      </div>
    );
  }
  client.writeData({
    data: {
      editSaDetail_ReceiptDate: moment.utc(editSaDetail.ReceiptDate).format("DD-MM-YYYY"),
      editSaDetail_DepositDate: moment.utc(editSaDetail.DepositDate).format("DD-MM-YYYY"),
      editSaDetail_ReceiptNumber: editSaDetail.ReceiptNumber,
      editSaDetail_StudentName: editSaDetail.StudentName,
      editSaDetail_CanteenSecurity: editSaDetail.CanteenSecurity,
      editSaDetail_MessSecurity: editSaDetail.MessSecurity,
      editSaDetail_HostelSecurity: editSaDetail.HostelSecurity,
      editSaDetail_RollNumber: editSaDetail.RollNumber,
      editSaDetail_RoomNumber: editSaDetail.RoomNumber,
      editSaDetail_id: editSaDetail._id
    }
  });
  const state = client.readQuery({
    query: STATE
  });
  return <EditSaDetail client={client} history={history} state={state} />;
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editSaDetail: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

FormatData.defaultProps = {
  editSaDetail: {}
};

export default graphql(EDIT_SA_DETAIL, {
  props: ({ data: { loading, editSaDetail } }) => ({
    loading,
    editSaDetail
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      detId: ownProps.match.params.detId
    }
  })
})(withRouter(FormatData));
