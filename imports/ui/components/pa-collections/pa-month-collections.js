import * as Styles from "../../../modules/styles";

import { Link, withRouter } from "react-router-dom";
import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "/imports/ui/components/shared/Loading";
import { Pagination } from "react-bootstrap";
import PropTypes from "prop-types";
import React from "react";

const AUTO_DEPOSIT = gql`
  mutation($month: String!) {
    autoDepositPaMonth(month: $month)
  }
`;

const REMOVE_MONTH = gql`
  mutation($month: String!) {
    removePaMonth(month: $month)
  }
`;

class PaMonthCollections extends React.Component {
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
    this.props.history.push(`/pa-month-collections/${eventKey}`);
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
      <div className="row">
        <div className="col-md-12">
          <table className="table table-bordered table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="10" className="text-center h4">
                  <strong>Private A/c Monthly Collections</strong>
                  &nbsp;
                </th>
              </tr>
              <tr>
                <th
                  colSpan="10"
                  className="text-center"
                  style={Styles.PaginationRow}
                >
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
                <th style={Styles.WidthTwentyPaddingThreeCenter}>
                  Deposit Month
                </th>
                <th colSpan="3" style={Styles.WidthTwentyPaddingThreeCenter}>
                  Actions
                </th>
                <th style={Styles.WidthTwentyPaddingThreeCenter}>
                  Receipts Total
                </th>
                <th style={Styles.WidthTwentyPaddingThreeCenter}>
                  Deposited Amount
                </th>
                <th style={Styles.WidthTwentyPaddingThreeCenter}>
                  Excess Deposit
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.monthTotals.map(detail => (
                <tr key={detail.DepositDate}>
                  <th style={Styles.WidthTwentyPaddingThreeCenter}>
                    {detail.DepositMonth}
                  </th>
                  <td style={Styles.PaddingThreeCenter}>
                    <Link
                      target="_blank"
                      data-toggle="tooltip"
                      title="Print Pa Day Total"
                      to={`/pa-month-collections-print/${detail._id}`}
                    >
                      <i className="fa fa-print" />
                    </Link>
                  </td>
                  <td style={Styles.PaddingThreeCenter}>
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
                  <td style={Styles.PaddingThreeCenter}>
                    <a
                      href=""
                      data-month={detail.DepositMonth}
                      onClick={this.delete}
                    >
                      <i className="fa fa-trash-o" />
                    </a>
                  </td>
                  <td style={Styles.WidthTwentyPaddingThreeCenter}>
                    &#8377; {detail.Total}
                  </td>
                  <td style={Styles.WidthTwentyPaddingThreeCenter}>
                    &#8377; {detail.Deposit}
                  </td>
                  <td style={Styles.WidthTwentyPaddingThreeCenter}>
                    &#8377; {detail.ExcessDeposit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

PaMonthCollections.propTypes = {
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
      <div style={Styles.Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <PaMonthCollections
      loading={props.loading}
      monthTotals={props.paMonthTotalsByPage.monthTotals}
      count={props.paMonthTotalsByPage.count}
      match={props.match}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  paMonthTotalsByPage: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  paMonthTotalsByPage: {
    monthTotals: [],
    count: 0
  }
};

const PA_MONTH_COLLECTIONS = gql`
  query($pageNo: Int!) {
    paMonthTotalsByPage(pageNo: $pageNo)
  }
`;

export default graphql(PA_MONTH_COLLECTIONS, {
  props: ({ data: { loading, paMonthTotalsByPage, refetch } }) => ({
    loading,
    paMonthTotalsByPage,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      pageNo: ownProps.match.params.pageNo
    }
  })
})(withRouter(withApollo(FormatData)));