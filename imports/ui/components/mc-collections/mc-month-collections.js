import { Link, withRouter } from "react-router-dom";
import { Middle, PaddingThreeCenter, PaginationRow, WidthTwentyPaddingThreeCenter } from "../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { Pagination } from "react-bootstrap";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";

const AUTO_DEPOSIT = gql`
  mutation($month: String!) {
    autoDepositMcMonth(month: $month)
  }
`;

const REMOVE_MONTH = gql`
  mutation($month: String!) {
    removeMcMonth(month: $month)
  }
`;

class McMonthCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: parseInt(this.props.match.params.pageNo, 10),
      range: 15
    };
    this.delete = this.delete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.pagesNo = this.pagesNo.bind(this);
    this.autoDeposit = this.autoDeposit.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({ activePage: eventKey });
    this.props.history.push(`/mc-month-collections/${eventKey}`);
  }

  delete(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: REMOVE_MONTH,
        variables: {
          month: e.currentTarget.dataset.month
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.refetch;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  autoDeposit(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: AUTO_DEPOSIT,
        variables: {
          month: e.currentTarget.dataset.month
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.refetch;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  pagesNo(arrayLength) {
    return Math.ceil(arrayLength / this.state.range);
  }

  render() {
    return (
      <span>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-bordered table-condensed table-striped text-center">
              <thead>
                <tr>
                  <th colSpan="10" className="text-center h4">
                    <strong>Mess Canteen A/c Monthly Collections</strong>
                    &nbsp;
                  </th>
                </tr>
                <tr>
                  <th colSpan="10" className="text-center" style={PaginationRow}>
                    <Pagination
                      prev
                      next
                      first
                      last
                      ellipsis
                      boundaryLinks
                      items={this.pagesNo(this.props.count)}
                      maxButtons={9}
                      activePage={this.state.activePage}
                      onSelect={this.handleSelect}
                    />
                  </th>
                </tr>
                <tr>
                  <th style={WidthTwentyPaddingThreeCenter}>Deposit Month</th>
                  <th colSpan="3" style={WidthTwentyPaddingThreeCenter}>
                    Actions
                  </th>
                  <th style={WidthTwentyPaddingThreeCenter}>Receipts Total</th>
                  <th style={WidthTwentyPaddingThreeCenter}>Deposited Amount</th>
                  <th style={WidthTwentyPaddingThreeCenter}>Excess Deposit</th>
                </tr>
              </thead>
              <tbody>
                {this.props.monthTotals.map(detail => (
                  <tr key={detail.DepositDate}>
                    <th style={WidthTwentyPaddingThreeCenter}>{detail.DepositMonth}</th>
                    <td style={PaddingThreeCenter}>
                      <Link
                        target="_blank"
                        data-toggle="tooltip"
                        title="Print Mc Day Total"
                        to={`/mc-month-collections-print/${detail._id}`}
                      >
                        <i className="fa fa-print" />
                      </Link>
                    </td>
                    <td style={PaddingThreeCenter}>
                      <a
                        target="_blank"
                        data-toggle="tooltip"
                        data-month={detail.DepositMonth}
                        title="Deposit Equals Receipts"
                        href=""
                        onClick={this.autoDeposit}
                      >
                        <i className="fa fa-arrows-h" aria-hidden="true" />
                      </a>
                    </td>
                    <td style={PaddingThreeCenter}>
                      <a href="" data-month={detail.DepositMonth} onClick={this.delete}>
                        <i className="fa fa-trash-o" />
                      </a>
                    </td>
                    <td style={WidthTwentyPaddingThreeCenter}>&#8377; {detail.Total}</td>
                    <td style={WidthTwentyPaddingThreeCenter}>&#8377; {detail.Deposit}</td>
                    <td style={WidthTwentyPaddingThreeCenter}>&#8377; {detail.ExcessDeposit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </span>
    );
  }
}

McMonthCollections.propTypes = {
  monthTotals: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
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
    <McMonthCollections
      loading={props.loading}
      monthTotals={props.mcMonthTotalsByPage.monthTotals}
      count={props.mcMonthTotalsByPage.count}
      match={props.match}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  mcMonthTotalsByPage: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  mcMonthTotalsByPage: {
    monthTotals: [],
    count: 0
  }
};

const MONTH_COLLECTIONS = gql`
  query($pageNo: Int!) {
    mcMonthTotalsByPage(pageNo: $pageNo)
  }
`;

export default graphql(MONTH_COLLECTIONS, {
  props: ({ data: { loading, mcMonthTotalsByPage, refetch } }) => ({
    loading,
    mcMonthTotalsByPage,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      pageNo: ownProps.match.params.pageNo
    }
  })
})(withRouter(withApollo(FormatData)));
