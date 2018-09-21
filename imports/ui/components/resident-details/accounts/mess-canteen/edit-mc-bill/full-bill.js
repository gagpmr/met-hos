import * as Styles from "/imports/modules/styles.js";

import { Loading } from "/imports/ui/components/shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import gqls from "./sharedGqls";

class FullBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      IsPaid: props.bill.IsPaid,
      MessOne: props.bill.MessOne,
      MessTwo: props.bill.MessTwo,
      Canteen: props.bill.Canteen,
      Amenity: props.bill.Amenity,
      HasMessFine: props.bill.HasMessFine,
      HasCanteenFine: props.bill.HasCanteenFine,
      BillPeriod: props.bill.BillPeriod
    };
    this.handleChange = this.handleChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    if (this.props.resident && this.props.bill) {
      this.props.client
        .mutate({
          mutation: gqls.updateMcBill,
          variables: {
            billType: "fullBill",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            isPaid: this.state.IsPaid,
            messOne: this.state.MessOne,
            messTwo: this.state.MessTwo,
            canteen: this.state.Canteen,
            amenity: this.state.Amenity,
            halfYearly: 0,
            hasMessFine: this.state.HasMessFine,
            hasCanteenFine: this.state.HasCanteenFine,
            billPeriod: this.state.BillPeriod
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
      switch (event.target.name) {
        case "HasCanteenFine":
          this.canteenFine.checked = false;
          break;
        case "HasMessFine":
          this.messFine.checked = false;
          break;
        default:
          break;
      }
      this.handleChange(event);
    } else if (event.key === "y" || event.key === "Y") {
      switch (event.target.name) {
        case "HasCanteenFine":
          this.canteenFine.checked = true;
          break;
        case "HasMessFine":
          this.messFine.checked = true;
          break;
        default:
          break;
      }
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
    if (this.props.loading) {
      return (
        <div style={Styles.Middle}>
          <Loading />
        </div>
      );
    }
    return (
      <tbody>
        <tr>
          <th>Select Month</th>
          <td style={Styles.PaddingThreeLeft}>
            <select
              autoFocus
              style={Styles.WidthSixtyPaddingZeroLeft}
              onKeyDown={this.keyPressed}
              value={this.state.BillPeriod}
              onChange={this.handleChange}
              name="BillPeriod"
            >
              {this.props.mcmonths.map((element, index) => (
                <option key={index} value={element.Value}>
                  {element.Value}
                </option>
              ))}
            </select>
          </td>
        </tr>
        <tr>
          <th>Mess One</th>
          <td style={Styles.PaddingThreeLeft}>
            <input
              style={Styles.WidthSixtyPaddingZeroLeft}
              type="text"
              name="MessOne"
              onKeyDown={this.keyPressed}
              defaultValue={this.state.MessOne}
              onChange={this.handleChange}
            />
          </td>
        </tr>
        <tr>
          <th>Mess Two</th>
          <td style={Styles.PaddingThreeLeft}>
            <input
              style={Styles.WidthSixtyPaddingZeroLeft}
              type="text"
              name="MessTwo"
              onKeyDown={this.keyPressed}
              defaultValue={this.state.MessTwo}
              onChange={this.handleChange}
            />
          </td>
        </tr>
        <tr>
          <th>Canteen</th>
          <td style={Styles.PaddingThreeLeft}>
            <input
              style={Styles.WidthSixtyPaddingZeroLeft}
              type="text"
              name="Canteen"
              onKeyDown={this.keyPressed}
              defaultValue={this.state.Canteen}
              onChange={this.handleChange}
            />
          </td>
        </tr>
        <tr>
          <th>Amenity</th>
          <td style={Styles.PaddingThreeLeft}>
            <input
              style={Styles.WidthSixtyPaddingZeroLeft}
              type="text"
              name="Amenity"
              onKeyDown={this.keyPressed}
              defaultValue={this.state.Amenity}
              onChange={this.handleChange}
            />
          </td>
        </tr>
        <tr>
          <th>Has Canteen Fine</th>
          <td style={Styles.PaddingThreeLeft}>
            <input
              type="checkbox"
              name="HasCanteenFine"
              ref={node => {
                this.canteenFine = node;
              }}
              onKeyDown={this.keyPressed}
              onChange={this.handleChange}
              defaultChecked={this.state.HasCanteenFine}
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
                this.messFine = node;
              }}
              onKeyDown={this.keyPressed}
              onChange={this.handleChange}
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

FullBill.propTypes = {
  loading: PropTypes.bool,
  resident: PropTypes.object,
  bill: PropTypes.object,
  mcmonths: PropTypes.array,
  history: PropTypes.object.isRequired
};

export default FullBill;
