import ApolloClient from "apollo-client";
import { PrintTableBorder } from "../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import gql from "graphql-tag";
import moment from "moment";

const REMOVE_SA_DETAIL = gql`
  mutation($detId: String!) {
    removeSaDetail(detId: $detId)
  }
`;

const CANCELLED_SA_DETAIL = gql`
  mutation($rNum: String!, $date: String!) {
    cancelledSaDetail(rNum: $rNum, date: $date)
  }
`;

const RESIDENT_DETAILS = gql`
  query($id: String!) {
    residentDetails(id: $id)
  }
`;

export class SaDetail extends React.Component {
  constructor(props) {
    super(props);
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

  remove(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: REMOVE_SA_DETAIL,
        variables: {
          detId: this.props.detail._id
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchSaDetails;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  insertCancelled(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: CANCELLED_SA_DETAIL,
        variables: {
          rNum: this.props.detail.ReceiptNumber,
          date: moment.utc(this.props.detail.DepositDate).format("DD-MM-YYYY")
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchSaDetails;
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

  editDetail(e) {
    e.preventDefault();
    this.props.history.push(`/edit-sa-detail/${this.props.detail._id}`);
  }

  render() {
    return (
      <tr
        ref={this.props.detail._id}
        id={this.props.detail._id}
        className="text-center"
      >
        <td style={PrintTableBorder}>
          {moment.utc(this.props.detail.ReceiptDate).format("DD-MM-YYYY")}
        </td>
        <td style={PrintTableBorder}>
          {moment.utc(this.props.detail.DepositDate).format("DD-MM-YYYY")}
        </td>
        <td style={PrintTableBorder}>{this.props.detail.ReceiptNumber}</td>
        <td style={PrintTableBorder}>{this.props.detail.RoomNumber}</td>
        <td style={PrintTableBorder}>{this.props.detail.RollNumber}</td>
        <td style={PrintTableBorder}>{this.props.detail.StudentName}</td>
        <td style={PrintTableBorder}>{this.props.detail.HostelSecurity}</td>
        <td style={PrintTableBorder}>{this.props.detail.MessSecurity}</td>
        <td style={PrintTableBorder}>{this.props.detail.CanteenSecurity}</td>
        <td style={PrintTableBorder}>{this.props.detail.Total}</td>
        <td style={PrintTableBorder} className="text-center">
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
        <td style={PrintTableBorder} className="text-center">
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
        <td style={PrintTableBorder} className="text-center">
          <a
            data-toggle="tooltip"
            title="Add Cancelled Detail"
            onClick={this.insertCancelled}
            href=""
          >
            <i className="fa fa-strikethrough" aria-hidden="true" />
          </a>
        </td>
        <td style={PrintTableBorder} className="text-center">
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

SaDetail.propTypes = {
  detail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  fetchSaDetails: PropTypes.func.isRequired
};
