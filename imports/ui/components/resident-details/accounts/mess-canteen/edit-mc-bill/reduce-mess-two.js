import React from "react";
import PropTypes from "prop-types";
import ApolloClient from "apollo-client";
import gqls from "./sharedGqls";
import * as Styles from "/imports/modules/styles.js";

class ReduceMessTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MessTwo: 0,
      HasMessFine: props.bill.HasMessFine,
      IsPaid: props.bill.IsPaid
    };
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.field.select();
  }

  submitForm(e) {
    e.preventDefault();
    if (this.props.resident && this.props.bill) {
      this.props.client
        .mutate({
          mutation: gqls.updateMcBill,
          variables: {
            billType: "messTwo",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            isPaid: this.state.IsPaid,
            messOne: this.props.bill.MessOne,
            messTwo: this.state.MessTwo,
            canteen: this.props.bill.Canteen,
            amenity: this.props.bill.Amenity,
            halfYearly: this.props.bill.HalfYearly,
            hasMessFine: this.state.HasMessFine,
            hasCanteenFine: this.props.bill.HasCanteenFine,
            billPeriod: this.props.bill.BillPeriod
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

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
    } else if (event.key === "n" || event.key === "N") {
      this.fine.checked = false;
      this.handleChange(event);
    } else if (event.key === "y" || event.key === "Y") {
      this.fine.checked = true;
      this.handleChange(event);
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

  render() {
    return (
      <tbody>
        <tr>
          <th>Unpaid Mc Total</th>
          <td style={Styles.PaddingThreeLeftBold}>
            {this.props.resident.UnpaidMcTotal.Total}
          </td>
        </tr>
        <tr>
          <th>Reduce Mess Two By</th>
          <td style={Styles.PaddingThreeLeft}>
            <input
              style={Styles.WidthSixtyPaddingZeroLeft}
              type="text"
              name="MessTwo"
              autoFocus
              ref={input => {
                this.field = input;
              }}
              onChange={this.handleChange}
              onKeyDown={this.keyPressed}
              defaultValue={0}
            />
          </td>
        </tr>
        <tr>
          <th>Has Mess Fine</th>
          <td style={Styles.PaddingThreeLeft}>
            <input
              type="checkbox"
              name="HasMessFine"
              ref={node => {
                this.fine = node;
              }}
              onChange={this.handleChange}
              onKeyDown={this.keyPressed}
              defaultChecked={this.state.HasMessFine}
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

ReduceMessTwo.propTypes = {
  resident: PropTypes.object,
  bill: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default ReduceMessTwo;
