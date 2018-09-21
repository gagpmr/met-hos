import ApolloClient from "apollo-client";
import PropTypes from "prop-types";
import React from "react";
import gqls from "./sharedGqls";

class PhdHra extends React.Component {
  constructor(props) {
    super(props);
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      Miscellaneous: props.bill.Miscellaneous,
      BillPeriod: props.bill.BillPeriod
    };
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
    }
  }

  submitForm(e) {
    e.preventDefault();
    if (this.props.resident && this.props.bill) {
      this.props.client
        .mutate({
          mutation: gqls.updatePaBill,
          variables: {
            billType: "phdHra",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            startDate: "",
            endDate: "",
            electricity: 0,
            billPeriod: this.state.BillPeriod,
            misc: parseInt(this.state.Miscellaneous, 10),
            roomRent: 0,
            security: 0,
            halfYearly: 0
          }
        })
        .then(() => {
          this.props.client.resetStore();
          this.props.history.push(
            `/resident-details/${this.props.resident._id}`
          );
        })
        .catch(error => {
          console.log("there was an error sending the query", error);
        });
    }
  }

  handleFocus(e) {
    const target = e.target;
    if (this.props.resident) {
      setTimeout(() => {
        target.select();
      }, 0);
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <tbody>
        <tr>
          <th>Miscellaneous</th>
          <td>
            <input
              onKeyDown={this.keyPressed}
              autoFocus
              type="text"
              name="Miscellaneous"
              onFocus={this.handleFocus}
              onChange={this.handleInputChange}
              defaultValue={this.state.Miscellaneous}
            />
          </td>
        </tr>
        <tr>
          <th>Bill Period</th>
          <td>
            <input
              onKeyDown={this.keyPressed}
              type="text"
              name="BillPeriod"
              onFocus={this.handleFocus}
              onChange={this.handleInputChange}
              defaultValue={this.state.BillPeriod}
            />
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

PhdHra.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default PhdHra;
