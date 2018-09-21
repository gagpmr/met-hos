import ApolloClient from "apollo-client";
import PropTypes from "prop-types";
import React from "react";
import gqls from "./sharedGqls";

export class Security extends React.Component {
  constructor(props) {
    super(props);
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      Security: props.bill.Security
    };
  }

  componentDidMount() {
    this.security.select();
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
            billType: "security",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            startDate: "",
            endDate: "",
            electricity: 0,
            billPeriod: this.props.bill.BillPeriod,
            misc: 0,
            roomRent: 0,
            security: parseInt(this.state.Security, 10),
            halfYearly: 0
          }
        })
        .then(() => {
          if (parseInt(this.state.Security, 10) !== this.props.bill.Security) {
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
          <th>Security</th>
          <td>
            <input
              onKeyDown={this.keyPressed}
              type="text"
              name="Security"
              ref={input => {
                this.security = input;
              }}
              onChange={this.handleInputChange}
              defaultValue={this.state.Security}
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

Security.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default Security;
