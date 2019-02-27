import ApolloClient from "apollo-client";
import { PrintTableBorder } from "../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import { gql } from "react-apollo";
import moment from "moment";

const REMOVE_PA_DETAIL = gql`
  mutation($detId: String!) {
    removePaDetail(detId: $detId)
  }
`;

const COPY_EDIT = gql`
  mutation($detId: String!) {
    copyEditPaDetail(detId: $detId)
  }
`;

const EDIT_PA_DETAIL = gql`
  query($detId: String!) {
    editPaDetail(detId: $detId)
  }
`;

const CANCELLED_PA_DETAIL = gql`
  mutation($rNum: String!, $date: String!) {
    cancelledPaDetail(rNum: $rNum, date: $date)
  }
`;

const RESIDENT_DETAILS = gql`
  query($id: String!) {
    residentDetails(id: $id)
  }
`;

export class PaDetail extends React.Component {
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
        this.node.scrollIntoView();
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
        this.props.client.resetStore().then(() => {
          this.props.client.query({
            query: EDIT_PA_DETAIL,
            variables: {
              detId: data.copyEditPaDetail
            }
          });
          this.props.history.push(`/edit-pa-detail/${data.copyEditPaDetail}`);
        });
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  remove(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: REMOVE_PA_DETAIL,
        variables: {
          detId: this.props.detail._id
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchPaDetails;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  insertCancelled(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: CANCELLED_PA_DETAIL,
        variables: {
          rNum: this.props.detail.ReceiptNumber,
          date: moment.utc(this.props.detail.DepositDate).format("DD-MM-YYYY")
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchPaDetails;
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
    this.props.client
      .query({
        query: EDIT_PA_DETAIL,
        variables: {
          detId: this.props.detail._id
        }
      })
      .then(() => {
        this.props.history.push(`/edit-pa-detail/${this.props.detail._id}`);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  render() {
    return (
      <tr
        // eslint-disable-next-line no-return-assign
        ref={node => (this.node = node)}
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
        <td style={PrintTableBorder}>{this.props.detail.Name}</td>
        <td style={PrintTableBorder}>{this.props.detail.RoomRent}</td>
        <td style={PrintTableBorder}>{this.props.detail.WaterCharges}</td>
        <td style={PrintTableBorder}>{this.props.detail.ElectricityCharges}</td>
        <td style={PrintTableBorder}>{this.props.detail.DevelopmentFund}</td>
        <td style={PrintTableBorder}>
          {this.props.detail.RutineHstlMaintnceCharges}
        </td>
        <td style={PrintTableBorder}>{this.props.detail.Miscellaneous}</td>
        <td style={PrintTableBorder}>{this.props.detail.Total}</td>
        <td style={PrintTableBorder} className="text-center">
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

PaDetail.propTypes = {
  detail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  fetchPaDetails: PropTypes.func.isRequired
};
