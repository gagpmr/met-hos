import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { Middle } from "../../../modules/styles";
import Pagination from "react-js-pagination";
import PropTypes from "prop-types";
import React from "react";

const REMOVE_HOLIDAY = gql`
  mutation($id: ID!) {
    removeHoliday(id: $id)
  }
`;

class Holidays extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      range: 15
    };
    this.remove = this.remove.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.pagesNo = this.pagesNo.bind(this);
  }

  remove(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: REMOVE_HOLIDAY,
        variables: {
          id: e.target.dataset.id
        }
      })
      .then(() => {
        this.props.client.resetStore();
      });
  }

  handleSelect(eventKey) {
    this.setState({ activePage: eventKey, range: 15 });
  }

  pagesNo(arrayLength) {
    return Math.ceil(arrayLength / this.state.range);
  }

  render() {
    const rows = [];
    if (this.props.holidays.length > 0) {
      let startIndex =
        this.state.activePage * this.state.range - this.state.range;
      for (let index = 0; index < this.state.range; index++) {
        const element = this.props.holidays[startIndex];
        if (element !== undefined) {
          rows.push(
            <tr key={element._id}>
              <th className="text-center font-bolder">{element.StringValue}</th>
              <td className="text-center font-bolder">
                <a href="" data-id={element._id} onClick={this.remove}>
                  Delete
                </a>
              </td>
            </tr>
          );
        }
        startIndex++;
      }
    }
    return (
      <span>
        <div className="col-md-6 col-md-offset-3">
          <table className="table table-bordered table-condensed table-striped">
            <thead>
              <tr>
                <th colSpan="6" className="text-center h4 font-bolder">
                  Holidays &nbsp;
                  <a href="/add-holiday">
                    <i className="fa fa-plus" aria-hidden="true" />
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
        <div className="hPagination">
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={15}
            totalItemsCount={this.props.holidays.length}
            onChange={this.handleSelect}
          />
        </div>
      </span>
    );
  }
}

Holidays.propTypes = {
  holidays: PropTypes.array.isRequired,
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
    <Holidays
      loading={props.loading}
      holidays={props.holidays}
      refetch={props.refetch}
      history={props.history}
      client={props.client}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  holidays: PropTypes.array,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

FormatData.defaultProps = {
  holidays: []
};

const HOLIDAYS = gql`
  query {
    holidays
  }
`;

export default graphql(HOLIDAYS, {
  props: ({ data: { loading, holidays, refetch } }) => ({
    loading,
    holidays,
    refetch
  }),
  forceFetch: true
})(withApollo(FormatData));
