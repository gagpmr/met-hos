import ApolloClient from "apollo-client";
import PropTypes from "prop-types";
import React from "react";
import { WidthEightyPaddingZeroLeft } from "../../../../../../modules/styles";
import gqls from "./sharedGqls";

class Regular extends React.Component {
  constructor(props) {
    super(props);
    this.getMonth = this.getMonth.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      BillPeriod: props.selectedMonth
    };
  }

  getMonth(e) {
    this.setState({ Month: e.target.value });
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

  submitForm(e) {
    e.preventDefault();
    if (this.props.resident && this.props.bill) {
      this.props.client
        .mutate({
          mutation: gqls.updatePaBill,
          variables: {
            billType: "regular",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            startDate: "",
            endDate: "",
            electricity: 0,
            billPeriod: this.state.BillPeriod,
            misc: 0,
            roomRent: 0,
            security: 0,
            halfYearly: 0
          }
        })
        .then(() => {
          if (this.state.BillPeriod !== this.props.bill.BillPeriod) {
            this.props.client.resetStore().then(() => {
              this.props.client
                .query({
                  query: gqls.residentDetails,
                  variables: {
                    id: this.props.resident._id
                  }
                })
                .then(() => {
                  this.props.history.push(
                    `/resident-details/${this.props.resident._id}`
                  );
                })
                .catch(error => {
                  console.log("Error:- NIGHT_STAY", error);
                });
            });
          }
        })
        .catch(error => {
          console.log("there was an error sending the query", error);
        });
    }
  }

  render() {
    return (
      <tbody>
        <tr>
          <th>Select Month</th>
          <td>
            <select
              autoFocus
              style={WidthEightyPaddingZeroLeft}
              onKeyDown={this.keyPressed}
              value={this.state.BillPeriod}
              onChange={this.handleChange}
              name="BillPeriod"
            >
              {this.props.pamonths.map((element, index) => (
                <option key={index} value={element.Value}>
                  {element.Value}
                </option>
              ))}
            </select>
          </td>
        </tr>
        <tr>
          <th className="text-center" colSpan="2">
            <a onClick={this.submitForm} onKeyDown={this.keyPressed} href="">
              Save
            </a>
          </th>
        </tr>
      </tbody>
    );
  }
}

Regular.propTypes = {
  bill: PropTypes.object.isRequired,
  pamonths: PropTypes.array.isRequired,
  resident: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default Regular;
