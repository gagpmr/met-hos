import { graphql, withApollo } from "react-apollo";
import { handleChange, keyPressed } from "../shared/Functions";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { Middle } from "../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";
import { withRouter } from "react-router-dom";

const MC_COLLECTIONS = gql`
  query($pageNo: Int!) {
    mcDayTotalsByPage(pageNo: $pageNo)
  }
`;

const UPDATE_MC_DAY_TOTAL = gql`
  mutation($detId: ID!, $deposit: Int!) {
    updateMcDayTotal(detId: $detId, deposit: $deposit)
  }
`;

const STATE = gql`
  query {
    deposit
  }
`;

class EditMcDayTotal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Deposit: props.detail.Deposit
    };
    this.submitForm = this.handleSubmit.bind(this);
    // this.keyPressed = this.keyPressed.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  handleFocus(e) {
    e.persist();
    if (this.props.detail !== undefined) {
      setTimeout(() => {
        e.target.select();
      }, 0);
    }
  }

  handleSubmit(e, client) {
    e.preventDefault();
    const state = client.readQuery({
      query: STATE
    });
    this.props.client
      .mutate({
        mutation: UPDATE_MC_DAY_TOTAL,
        variables: {
          detId: this.props.detail._id,
          deposit: state.deposit
        }
      })
      .then(() => {
        this.props.client.resetStore().then(() => {
          this.props.client
            .query({
              query: MC_COLLECTIONS,
              variables: {
                pageNo: this.props.match.params.pageNo
              }
            })
            .then(() => {
              this.props.history.push(`/mc-collections/${this.props.match.params.pageNo}`);
            })
            .catch(error => {
              console.log("Error:- MC_COLLECTIONS", error);
            });
        });
      })
      .catch(error => {
        console.log("Error:- UPDATE_MC_DAY_TOTAL", error);
      });
  }

  // keyPressed(event, client) {
  //   if (event.key === "Enter") {
  //     this.submitForm(event, client);
  //   }
  // }

  // handleChange(event) {
  //   const target = event.target;
  //   const value = target.type === "checkbox" ? target.checked : target.value;
  //   const name = target.name;
  //   this.setState({
  //     [name]: value
  //   });
  // }

  render() {
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <table className="table table-bordered table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="2" className="text-center h4">
                  Edit Mess Canteen Day Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="text-center">Deposit Date</th>
                <td className="text-center">{moment.utc(this.props.detail.DepositDate).format("DD-MM-YYYY")}</td>
              </tr>
              <tr>
                <th className="text-center">Receipts Total</th>
                <td className="text-center">{this.props.detail.Total}</td>
              </tr>
              <tr>
                <th className="text-center">Deposited Amount</th>
                <td className="text-center">
                  <input
                    autoFocus
                    onFocus={this.handleFocus}
                    onChange={e => handleChange(e, this.props.client)}
                    onKeyDown={e => keyPressed(e, this.props.client, this)}
                    type="text"
                    tabIndex="-1"
                    name="deposit"
                    defaultValue={this.state.Deposit}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center" colSpan="2">
                  <a id="save-form" onClick={e => handleSubmit(e, this.props.client)} href="">
                    Save
                  </a>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

EditMcDayTotal.propTypes = {
  detail: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
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
    <EditMcDayTotal
      detail={props.editMcDayTotal.detail}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
      match={props.match}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editMcDayTotal: PropTypes.object,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

FormatData.defaultProps = {
  editMcDayTotal: {}
};
const EDIT_MC_DAY_TOTAL = gql`
  query($detId: String!) {
    editMcDayTotal(detId: $detId)
  }
`;

export default graphql(EDIT_MC_DAY_TOTAL, {
  props: ({ data: { loading, editMcDayTotal, refetch } }) => ({
    loading,
    editMcDayTotal,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      detId: ownProps.match.params.detId
    }
  })
})(withRouter(withApollo(FormatData)));
