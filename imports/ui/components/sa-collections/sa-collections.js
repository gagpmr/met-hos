import * as Styles from "/imports/modules/styles.js";

import { Link, withRouter } from "react-router-dom";
import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "/imports/ui/components/shared/Loading";
import { Pagination } from "react-bootstrap";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

const REMOVE_SA_DAY_TOTAL = gql`
  mutation($depositDate: String!) {
    removeSaDayTotal(depositDate: $depositDate)
  }
`;

const AUTO_DEPOSIT = gql`
  mutation($id: ID!) {
    autoDepositSaDayTotal(id: $id)
  }
`;

class SaCollections extends React.Component {
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
    this.props.history.push(`/sa-collections/${eventKey}`);
  }

  delete(e) {
    e.preventDefault();
    const depositDate = moment
      .utc(e.currentTarget.dataset.date)
      .format("DD-MM-YYYY");
    this.props.client
      .mutate({
        mutation: REMOVE_SA_DAY_TOTAL,
        variables: {
          depositDate
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.refetch;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
    if (this.props.dayTotals.length === 1) {
      const pageNo = parseInt(this.props.match.params.pageNo, 10) - 1;
      this.setState({ activePage: pageNo });
      this.props.history.push(`/sa-collections/${pageNo}`);
    } else {
      this.props.history.push(
        `/sa-collections/${this.props.match.params.pageNo}`
      );
    }
  }

  autoDeposit(e) {
    e.preventDefault();
    const id = e.currentTarget.dataset.daytotalid;
    this.props.client
      .mutate({
        mutation: AUTO_DEPOSIT,
        variables: {
          id
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
                  <strong>Security A/c Collections</strong>
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
                  Deposit Date
                </th>
                <th colSpan="4" style={Styles.WidthTwentyPaddingThreeCenter}>
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
              {this.props.dayTotals.map(detail => (
                <tr key={detail._id}>
                  <th style={Styles.WidthTwentyPaddingThreeCenter}>
                    <a
                      href={`/sa-date-details/${moment
                        .utc(detail.DepositDate)
                        .format("DD-MM-YYYY")}`}
                    >
                      {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                    </a>
                  </th>
                  <td style={Styles.PaddingThreeCenter}>
                    <Link
                      data-toggle="tooltip"
                      title="Edit Sa Day Total"
                      to={`/edit-sa-day-total/${detail._id}/${
                        this.props.match.params.pageNo
                      }`}
                    >
                      <i className="fa fa-pencil-square-o" />
                    </Link>
                  </td>
                  <td style={Styles.PaddingThreeCenter}>
                    <Link
                      target="_blank"
                      data-toggle="tooltip"
                      title="Print Sa Day Total"
                      to={`/sa-date-details-print/${moment
                        .utc(detail.DepositDate)
                        .format("DD-MM-YYYY")}`}
                    >
                      <i className="fa fa-print" />
                    </Link>
                  </td>
                  <td style={Styles.PaddingThreeCenter}>
                    <a
                      target="_blank"
                      data-toggle="tooltip"
                      data-daytotalid={detail._id}
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
                      data-date={detail.DepositDate}
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

SaCollections.propTypes = {
  dayTotals: PropTypes.array.isRequired,
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
    <SaCollections
      loading={props.loading}
      dayTotals={props.saDayTotalsByPage.dayTotals}
      count={props.saDayTotalsByPage.count}
      match={props.match}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  saDayTotalsByPage: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  saDayTotalsByPage: {
    dayTotals: [],
    count: 0
  }
};

const SA_COLLECTIONS = gql`
  query($pageNo: Int!) {
    saDayTotalsByPage(pageNo: $pageNo)
  }
`;

export default graphql(SA_COLLECTIONS, {
  props: ({ data: { loading, saDayTotalsByPage, refetch } }) => ({
    loading,
    saDayTotalsByPage,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      pageNo: ownProps.match.params.pageNo
    }
  })
})(withRouter(withApollo(FormatData)));
