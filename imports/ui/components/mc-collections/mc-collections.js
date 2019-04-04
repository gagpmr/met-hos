import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import moment from "moment";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import React from "react";
import { graphql, withApollo } from "react-apollo";
import MDSpinner from "react-md-spinner";
import { Link, withRouter } from "react-router-dom";
import {
  h4,
  Middle,
  PaddingThreeCenter,
  PaginationRow,
  PaginationStyle,
  Table,
  TableHeader,
  WidthTwentyPaddingThreeCenter
} from "../../../modules/styles";

const REMOVE_MC_DAY_TOTAL = gql`
  mutation($depositDate: String!) {
    removeMcDayTotal(depositDate: $depositDate)
  }
`;

const AUTO_DEPOSIT = gql`
  mutation($id: ID!) {
    autoDepositMcDayTotal(id: $id)
  }
`;

export class McCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: parseInt(this.props.match.params.pageNo, 10)
    };
    this.delete = this.delete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.autoDeposit = this.autoDeposit.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({ activePage: eventKey });
    this.props.history.push(`/mc-collections/${eventKey}`);
  }

  delete(e) {
    e.preventDefault();
    const depositDate = moment.utc(e.currentTarget.dataset.date).format("DD-MM-YYYY");
    this.props.client
      .mutate({
        mutation: REMOVE_MC_DAY_TOTAL,
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
      this.props.history.push(`/mc-collections/${pageNo}`);
    } else {
      this.props.history.push(`/mc-collections/${this.props.match.params.pageNo}`);
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

  render() {
    return (
      <table style={Table}>
        <thead>
          <tr>
            <th style={TableHeader} colSpan="10">
              <h4 style={h4}>Mess Canteen A/c Collections</h4>
            </th>
          </tr>
          <tr>
            <th colSpan="10" style={PaginationRow}>
              <Pagination
                total={this.props.count}
                onChange={this.handleSelect}
                current={this.state.activePage}
                locale={localeInfo}
                defaultPageSize={15}
                style={PaginationStyle}
              />
            </th>
          </tr>
          <tr>
            <th style={WidthTwentyPaddingThreeCenter}>Deposit Date</th>
            <th colSpan="4" style={WidthTwentyPaddingThreeCenter}>
              Actions
            </th>
            <th style={WidthTwentyPaddingThreeCenter}>Receipts Total</th>
            <th style={WidthTwentyPaddingThreeCenter}>Deposited Amount</th>
            <th style={WidthTwentyPaddingThreeCenter}>Excess Deposit</th>
          </tr>
        </thead>
        <tbody>
          {this.props.dayTotals.map(detail => (
            <tr key={detail.DepositDate}>
              <th style={WidthTwentyPaddingThreeCenter}>
                <a
                  href={`/mc-date-details/${moment.utc(detail.DepositDate).format("DD-MM-YYYY")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                </a>
              </th>
              <td style={PaddingThreeCenter}>
                <Link
                  data-toggle="tooltip"
                  title="Edit Mc Day Total"
                  to={`/edit-mc-day-total/${detail._id}/${this.props.match.params.pageNo}`}
                >
                  <i className="fa fa-pencil-square-o" />
                </Link>
              </td>
              <td style={PaddingThreeCenter}>
                <Link
                  target="_blank"
                  data-toggle="tooltip"
                  title="Print Mc Day Total"
                  to={`/mc-date-details-print/${moment
                    .utc(detail.DepositDate)
                    .format("DD-MM-YYYY")}`}
                >
                  <i className="fa fa-print" />
                </Link>
              </td>
              <td style={PaddingThreeCenter}>
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
              <td style={PaddingThreeCenter}>
                <a href="" data-date={detail.DepositDate} onClick={this.delete}>
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
    );
  }
}

McCollections.propTypes = {
  dayTotals: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
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
    <McCollections
      loading={props.loading}
      dayTotals={props.mcDayTotalsByPage.dayTotals}
      count={props.mcDayTotalsByPage.count}
      match={props.match}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  mcDayTotalsByPage: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

FormatData.defaultProps = {
  mcDayTotalsByPage: {
    dayTotals: [],
    count: 0
  }
};

const MC_COLLECTIONS = gql`
  query($pageNo: Int!) {
    mcDayTotalsByPage(pageNo: $pageNo)
  }
`;

export default graphql(MC_COLLECTIONS, {
  props: ({ data: { loading, mcDayTotalsByPage, refetch } }) => ({
    loading,
    mcDayTotalsByPage,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      pageNo: ownProps.match.params.pageNo
    }
  })
})(withRouter(withApollo(FormatData)));
