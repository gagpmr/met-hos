import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { Middle } from "../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";
import { withRouter } from "react-router-dom";

const PA_COLLECTIONS = gql`
  query($pageNo: Int!) {
    paDayTotalsByPage(pageNo: $pageNo)
  }
`;

const UPDATE_PA_DAY_TOTAL = gql`
  mutation($detId: ID!, $deposit: Int!) {
    updatePaDayTotal(detId: $detId, deposit: $deposit)
  }
`;

export class EditPaDayTotal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Deposit: props.detail.Deposit
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
        mutation: UPDATE_PA_DAY_TOTAL,
        variables: {
          detId: this.props.detail._id,
          deposit: this.state.Deposit
        }
      })
      .then(() => {
        this.props.client.resetStore().then(() => {
          this.props.client
            .query({
              query: PA_COLLECTIONS,
              variables: {
                pageNo: this.props.match.params.pageNo
              }
            })
            .then(() => {
              this.props.history.push(`/pa-collections/${this.props.match.params.pageNo}`);
            })
            .catch(error => {
              console.log("there was an error sending the query", error);
            });
        });
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
                  Edit Private Account Day Total
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
                    tabIndex="0"
                    name="Deposit"
                    defaultValue={this.state.Deposit}
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

EditPaDayTotal.propTypes = {
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
    <EditPaDayTotal
      detail={props.editPaDayTotal.detail}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
      match={props.match}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editPaDayTotal: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  editPaDayTotal: {}
};
const EDIT_PA_DAY_TOTAL = gql`
  query($detId: String!) {
    editPaDayTotal(detId: $detId)
  }
`;

export default graphql(EDIT_PA_DAY_TOTAL, {
  props: ({ data: { loading, editPaDayTotal, refetch } }) => ({
    loading,
    editPaDayTotal,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      detId: ownProps.match.params.detId
    }
  })
})(withRouter(withApollo(FormatData)));
