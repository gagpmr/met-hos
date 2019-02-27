import {
  PaddingThreeLeft,
  PaddingThreeLeftBold,
  WidthSixtyPaddingZeroLeft
} from "../../../../../../modules/styles";

import ApolloClient from "apollo-client";
import PropTypes from "prop-types";
import React from "react";
import gqls from "./sharedGqls";
import { loadResident } from "../../../../../cache/methods";

class ReduceCanteen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Canteen: 0,
      HasCanteenFine: props.bill.HasCanteenFine,
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
            billType: "canteen",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            isPaid: this.state.IsPaid,
            messOne: this.props.bill.MessOne,
            messTwo: this.props.bill.MessTwo,
            canteen: this.state.Canteen,
            amenity: this.props.bill.Amenity,
            halfYearly: this.props.bill.HalfYearly,
            hasMessFine: this.props.bill.HasMessFine,
            hasCanteenFine: this.state.HasCanteenFine,
            billPeriod: this.props.bill.BillPeriod
          }
        })
        .then(() => {
          loadResident(this.props.resident._id, this.props.client);
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

  handleChange({ target }) {
    const { value, checked, type, name } = target;
    const nValue = type === "checkbox" ? checked : value;
    this.setState({
      [name]: nValue
    });
  }

  render() {
    return (
      <tbody>
        <tr>
          <th>Unpaid Mc Total</th>
          <td style={PaddingThreeLeftBold}>
            {this.props.resident.UnpaidMcTotal.Total}
          </td>
        </tr>
        <tr>
          <th>Reduce Canteen By</th>
          <td style={PaddingThreeLeft}>
            <input
              style={WidthSixtyPaddingZeroLeft}
              type="text"
              name="Canteen"
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
          <th>Has Canteen Fine</th>
          <td style={PaddingThreeLeft}>
            <input
              type="checkbox"
              name="HasCanteenFine"
              ref={node => {
                this.fine = node;
              }}
              onKeyDown={this.keyPressed}
              onChange={this.handleChange}
              defaultChecked={this.state.HasCanteenFine}
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

ReduceCanteen.propTypes = {
  resident: PropTypes.object,
  bill: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default ReduceCanteen;
