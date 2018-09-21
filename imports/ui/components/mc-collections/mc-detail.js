import * as Styles from "/imports/modules/styles";

import ApolloClient from "apollo-client";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { gql } from "react-apollo";
import moment from "moment";

const COPY_EDIT = gql`
  mutation($detId: String!) {
    copyEditMcDetail(detId: $detId)
  }
`;

const EDIT_MC_DETAIL = gql`
  query($detId: String!) {
    editMcDetail(detId: $detId)
  }
`;

const REMOVE_MC_DETAIL = gql`
  mutation($detId: String!) {
    removeMcDetail(detId: $detId)
  }
`;

const CANCELLED_MC_DETAIL = gql`
  mutation($rNum: String!, $date: String!) {
    cancelledMcDetail(rNum: $rNum, date: $date)
  }
`;

const RESIDENT_DETAILS = gql`
  query($id: String!) {
    residentDetails(id: $id)
  }
`;

export class McDetail extends React.Component {
  constructor(props) {
    super(props);
    this.copyEdit = this.copyEdit.bind(this);
    this.remove = this.remove.bind(this);
    this.insertCancelled = this.insertCancelled.bind(this);
    this.residentDetails = this.residentDetails.bind(this);
    this.editDetail = this.editDetail.bind(this);
  }

  componentDidMount() {
    if (this.props.detail !== undefined) {
      if (this.props.detail.Focus) {
        ReactDOM.findDOMNode(this.refs[this.props.detail._id]).scrollIntoView();
      }
    }
  }

  copyEdit(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: COPY_EDIT,
        variables: {
          detId: this.props.detail._id
        }
      })
      .then(({ data }) => {
        this.props.client.resetStore();
        this.props.client.query({
          query: EDIT_MC_DETAIL,
          variables: {
            detId: data.copyEditMcDetail
          }
        });
        // this.props.history.push(`/edit-mc-detail/${data.copyEditMcDetail}`);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  editDetail(e) {
    e.preventDefault();
    this.props.history.push(`/edit-mc-detail/${this.props.detail._id}`);
  }

  remove(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: REMOVE_MC_DETAIL,
        variables: {
          detId: this.props.detail._id
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchMcDetails;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  insertCancelled(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: CANCELLED_MC_DETAIL,
        variables: {
          rNum: this.props.detail.ReceiptNumber,
          date: moment.utc(this.props.detail.DepositDate).format("DD-MM-YYYY")
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchMcDetails;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  residentDetails(e) {
    e.preventDefault();
    this.props.client
      .query({
        query: RESIDENT_DETAILS,
        variables: {
          id: this.props.detail.ResidentId
        }
      })
      .then(() => {
        this.props.history.push(
          `/resident-details/${this.props.detail.ResidentId}`
        );
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  render() {
    return (
      <tr
        ref={this.props.detail._id}
        id={this.props.detail._id}
        className="text-center"
      >
        <td style={Styles.PrintTableBorder}>
          {moment.utc(this.props.detail.ReceiptDate).format("DD-MM-YYYY")}
        </td>
        <td style={Styles.PrintTableBorder}>
          {moment.utc(this.props.detail.DepositDate).format("DD-MM-YYYY")}
        </td>
        <td style={Styles.PrintTableBorder}>
          {this.props.detail.ReceiptNumber}
        </td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.RoomNumber}</td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.RollNumber}</td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.StudentName}</td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.MessOne}</td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.MessTwo}</td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.Canteen}</td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.Fines}</td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.Amenity}</td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.FoodSubsidy}</td>
        <td style={Styles.PrintTableBorder}>
          {this.props.detail.PoorStuWelFund}
        </td>
        <td style={Styles.PrintTableBorder}>
          {this.props.detail.McServantWelFund}
        </td>
        <td style={Styles.PrintTableBorder}>
          {this.props.detail.CelebrationFund}
        </td>
        <td style={Styles.PrintTableBorder}>{this.props.detail.Total}</td>
        <td style={Styles.PrintTableBorder} className="text-center">
          <a
            target="_blank"
            data-toggle="tooltip"
            title="Copy Edit Detail"
            onClick={this.copyEdit}
            href=""
          >
            <i className="fa fa-files-o" aria-hidden="true" />
          </a>
        </td>
        <td style={Styles.PrintTableBorder} className="text-center">
          <a
            target="_blank"
            data-toggle="tooltip"
            title="Edit Detail"
            onClick={this.editDetail}
            href=""
          >
            <i className="fa fa-pencil-square-o" />
          </a>
        </td>
        <td style={Styles.PrintTableBorder} className="text-center">
          <a
            data-toggle="tooltip"
            title="Delete Detail"
            id="remove-detail"
            onClick={this.remove}
            href=""
          >
            <i className="fa fa-trash-o" aria-hidden="true" />
          </a>
        </td>
        <td style={Styles.PrintTableBorder} className="text-center">
          <a
            data-toggle="tooltip"
            title="Add Cancelled Detail"
            onClick={this.insertCancelled}
            href=""
          >
            <i className="fa fa-strikethrough" aria-hidden="true" />
          </a>
        </td>
        <td style={Styles.PrintTableBorder} className="text-center">
          <a
            target="_blank"
            data-toggle="tooltip"
            title="Resident Details"
            onClick={this.residentDetails}
            href=""
          >
            <i className="fa fa-user-circle" aria-hidden="true" />
          </a>
        </td>
      </tr>
    );
  }
}

McDetail.propTypes = {
  detail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  fetchMcDetails: PropTypes.func.isRequired
};
