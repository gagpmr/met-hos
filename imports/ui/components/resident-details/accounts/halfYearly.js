import React from "react";
import PropTypes from "prop-types";
import ApolloClient from "apollo-client";

class HalfYearly extends React.Component {
  constructor(props) {
    super(props);
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    this.halfYearly.focus();
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
    }
  }

  submitForm(e) {
    e.preventDefault();
    if (this.props.resident && this.props.bill) {
      this.props.history.push(`/resident-details/${this.props.resident._id}`);
    }
  }

  render() {
    return (
      <tbody>
        <tr>
          <th>{this.props.bill.BillPeriod}</th>
          <td>
            <input
              onKeyDown={this.keyPressed}
              type="text"
              disabled
              name="HalfYearly"
              defaultValue={this.props.bill.HalfYearly}
            />
          </td>
        </tr>
        <tr>
          <th className="text-center" colSpan="2">
            <a
              tabIndex="0"
              onClick={this.submitForm}
              ref={a => {
                this.halfYearly = a;
              }}
              onKeyDown={this.keyPressed}
              href=""
            >
              Save
            </a>
          </th>
        </tr>
      </tbody>
    );
  }
}

HalfYearly.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default HalfYearly;
