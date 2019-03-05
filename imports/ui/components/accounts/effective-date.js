import "../../layouts/datepicker.css";

import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import DatePicker from "react-datepicker";
import MDSpinner from "react-md-spinner";
import { Middle } from "../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";

const UPDATE_DATE = gql`
  mutation($effectiveDate: String!) {
    updateDate(effectiveDate: $effectiveDate)
  }
`;

const AUTOGENERATE = gql`
  mutation {
    dateAutoGenerate
  }
`;

class EffectiveDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(props.date.EffectiveDate).toDate(),
      dateVisible: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveToday = this.saveToday.bind(this);
    this.enableGenerate = this.enableGenerate.bind(this);
    this.disableGenerate = this.disableGenerate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date.EffectiveDateStr !== this.props.date.EffectiveDateStr) {
      this.setState({
        startDate: moment(nextProps.date.EffectiveDate).toDate(),
        dateVisible: false
      });
    }
  }

  handleChange(date) {
    const value = moment(date).format("DD-MMM-YYYY");
    this.props.client
      .mutate({
        mutation: UPDATE_DATE,
        variables: {
          effectiveDate: value
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

  saveToday(event) {
    event.preventDefault();
    const now = moment.utc().utcOffset(+5.5);
    const actualDate = now.format("DD-MMM-YYYY");
    this.props.client
      .mutate({
        mutation: UPDATE_DATE,
        variables: {
          effectiveDate: actualDate
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

  enableGenerate(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: AUTOGENERATE
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.refetch;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  disableGenerate(e) {
    e.preventDefault();
    this.setState({ dateVisible: true });
  }

  render() {
    if (this.props.loading) {
      return (
        <div style={Middle}>
          <MDSpinner />
        </div>
      );
    }
    const dateRows = [];
    if (this.state.dateVisible) {
      dateRows.push(
        <tr key="1">
          <th className="text-center width-effective-date">Change Date</th>
          <td className="text-center">
            <DatePicker
              dateFormat="dd-MM-yyyy"
              selected={this.state.startDate}
              onKeyDown={this.keyPressed}
              onChange={this.handleChange}
            />
          </td>
        </tr>
      );
    }
    return (
      <div className="col-md-6 col-md-offset-3">
        <table className="table table-bordered table-condensed table-striped">
          <thead>
            <tr>
              <th colSpan="3" className="text-center h4 font-bolder">
                <strong>Effective Date &nbsp; ({this.props.date.EffectiveDateStr})</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-center width-effective-date">String Value</th>
              <td className="text-center">{this.props.date.EffectiveDateStr}</td>
            </tr>
            <tr>
              <th className="text-center width-effective-date">Date with Time</th>
              <td className="text-center">{this.state.startDate.toString()}</td>
            </tr>
            <tr>
              <th className="text-center width-effective-date">Auto Generate</th>
              <td className="text-center">{this.props.date.AutoGenerate.toString()}</td>
            </tr>
            <tr>
              <td colSpan="2" className="text-center h4 font-bolder">
                Actions
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="text-center">
                <a href="" onClick={this.saveToday}>
                  Effective Date Today
                </a>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="text-center">
                <a href="" onClick={this.enableGenerate}>
                  Effective Date Auto
                </a>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="text-center">
                <a href="" onClick={this.disableGenerate}>
                  Alter Effective Date
                </a>
              </td>
            </tr>
            {dateRows}
          </tbody>
        </table>
      </div>
    );
  }
}

EffectiveDate.propTypes = {
  loading: PropTypes.bool.isRequired,
  date: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  refetch: PropTypes.func.isRequired
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
    <EffectiveDate loading={props.loading} date={props.effectiveDate} client={props.client} refetch={props.refetch} />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  effectiveDate: PropTypes.object,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

FormatData.defaultProps = {
  effectiveDate: {
    date: {
      EffectiveDateStr: moment(new Date()).format("DD-MM-YYYY"),
      AutoGenerate: true,
      EffectiveDate: new Date()
    }
  }
};

const EFFECTIVE_DATE = gql`
  query {
    effectiveDate
  }
`;

export default graphql(EFFECTIVE_DATE, {
  props: ({ data: { loading, effectiveDate, refetch } }) => ({
    loading,
    effectiveDate,
    refetch
  }),
  forceFetch: true
})(withApollo(FormatData));
