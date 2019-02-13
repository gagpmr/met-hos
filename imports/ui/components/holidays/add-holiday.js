import "../../layouts/datepicker.css";

import { gql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";

const INSERT_HOLIDAY = gql`
  mutation($date: String!) {
    insertHoliday(date: $date)
  }
`;

class AddHoliday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().toDate()
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveToday = this.saveToday.bind(this);
    this.insertDate = this.insertDate.bind(this);
  }

  handleChange(date) {
    const newdate = moment(date).format("DD-MMM-YYYY");
    this.insertDate(newdate);
  }

  saveToday(event) {
    event.preventDefault();
    const newdate = this.state.startDate.format("DD-MMM-YYYY");
    this.insertDate(newdate);
  }

  insertDate(date) {
    this.props.client
      .mutate({
        mutation: INSERT_HOLIDAY,
        variables: {
          date
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.history.push("/holidays");
      });
  }

  render() {
    return (
      <div className="col-md-4 col-md-offset-4">
        <table className="table table-bordered table-condensed table-striped">
          <thead>
            <tr>
              <th colSpan="6" className="text-center h4 font-bolder">
                Holidays
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">
                <DatePicker
                  dateFormat="dd-MMM-yyyy"
                  className="text-center"
                  tabIndex={-1}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  selected={this.state.startDate}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className="text-center">
                <a onClick={this.saveToday} href="">
                  {`Save Today's Date`}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

AddHoliday.propTypes = {
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default withRouter(withApollo(AddHoliday));
