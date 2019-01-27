import ApolloClient from "apollo-client";
import PropTypes from "prop-types";
import React from "react";
import gqls from "./sharedGqls";

class FineWarden extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FineWarden: props.bill.Miscellaneous
    };
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fineWarden.select();
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
            billType: "fineWarden",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            startDate: "",
            endDate: "",
            electricity: 0,
            billPeriod: "",
            misc: this.state.FineWarden,
            roomRent: 0,
            security: 0,
            halfYearly: 0
          }
        })
        .then(() => {
          if (this.state.FineWarden !== this.props.bill.Miscellaneous) {
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
                  console.log("Error:- FINE_WARDEN", error);
                });
            });
          }
        })
        .catch(error => {
          console.log("there was an error sending the query", error);
        });
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
          <th>Fine Warden</th>
          <td>
            <input
              onKeyDown={this.keyPressed}
              type="text"
              name="FineWarden"
              ref={input => {
                this.fineWarden = input;
              }}
              onChange={this.handleChange}
              defaultValue={this.props.bill.Miscellaneous}
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

FineWarden.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default FineWarden;
