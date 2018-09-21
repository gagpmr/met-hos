import ApolloClient from "apollo-client";
import PropTypes from "prop-types";
import React from "react";
import gqls from "./sharedGqls";

export class Electricity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Electricity: props.bill.ElectricityCharges
    };
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.electricity.select();
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
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

  submitForm(e) {
    e.preventDefault();
    if (this.props.resident && this.props.bill) {
      this.props.client
        .mutate({
          mutation: gqls.updatePaBill,
          variables: {
            billType: "electricity",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            startDate: "",
            endDate: "",
            electricity: this.state.Electricity,
            billPeriod: "",
            misc: 0,
            roomRent: 0,
            security: 0,
            halfYearly: 0
          }
        })
        .then(() => {
          if (this.props.bill.Electricity !== this.state.Electricity) {
            this.props.client.resetStore();
          }
          this.props.history.push(
            `/resident-details/${this.props.resident._id}`
          );
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
          <th>Electricity</th>
          <td>
            <input
              onKeyDown={this.keyPressed}
              type="text"
              name="Electricity"
              ref={input => {
                this.electricity = input;
              }}
              onChange={this.handleInputChange}
              defaultValue={this.state.Electricity}
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

Electricity.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default Electricity;
