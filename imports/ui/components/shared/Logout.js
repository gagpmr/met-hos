import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    Meteor.logout(() => this.props.history.push("/"));
  }

  render() {
    return (
      <span>
        <a onClick={this.handleLogout}>
          <i className="fa fa-sign-out" aria-hidden="true" />
        </a>
      </span>
    );
  }
}

Logout.propTypes = {
  history: PropTypes.object
};

export default Logout;
