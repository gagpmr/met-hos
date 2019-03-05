import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { Middle } from "../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";
import { withRouter } from "react-router-dom";

const UPDATE_SA_DAY_TOTAL = gql`
  mutation($detId: ID!, $deposit: Int!) {
    updateSaDayTotal(detId: $detId, deposit: $deposit)
  }
`;

export class EditSaDayTotal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Deposit: 0
    };
    this.submitForm = this.submitForm.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleFocus(e) {
    e.persist();
    if (this.props.detail !== undefined) {
      setTimeout(() => {
        e.target.select();
      }, 0);
    }
  }

  submitForm(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: UPDATE_SA_DAY_TOTAL,
        variables: {
          detId: this.props.detail._id,
          deposit: this.state.Deposit
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.history.push(`/sa-collections/${this.props.match.params.pageNo}`);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <table className="table table-bordered table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="2" className="text-center h4">
                  Edit Security Day Total
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
                    onKeyDown={this.keyPressed}
                    onChange={this.handleChange}
                    type="text"
                    tabIndex="1"
                    name="Deposit"
                    defaultValue={this.props.detail.Deposit}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center" colSpan="2">
                  <a id="save-form" onClick={this.submitForm} href="">
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

EditSaDayTotal.propTypes = {
  detail: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
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
    <EditSaDayTotal
      detail={props.editSaDayTotal.detail}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
      match={props.match}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editSaDayTotal: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  editSaDayTotal: {}
};

const EDIT_SA_DAY_TOTAL = gql`
  query($detId: String!) {
    editSaDayTotal(detId: $detId)
  }
`;

export default graphql(EDIT_SA_DAY_TOTAL, {
  props: ({ data: { loading, editSaDayTotal, refetch } }) => ({
    loading,
    editSaDayTotal,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      detId: ownProps.match.params.detId
    }
  })
})(withRouter(withApollo(FormatData)));
