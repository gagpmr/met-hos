import "./Profile.scss";

import { Button, Col, ControlLabel, FormGroup, Row } from "react-bootstrap";

import { Accounts } from "meteor/accounts-base";
import { Bert } from "meteor/themeteorchef:bert";
import InputHint from "../../components/InputHint/InputHint";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import validate from "../../../modules/validate";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderPasswordUser = this.renderPasswordUser.bind(this);
    this.renderProfileForm = this.renderProfileForm.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        emailAddress: {
          required: true,
          email: true
        },
        currentPassword: {
          required() {
            // Only required if newPassword field has a value.
            return component.newPassword.value.length > 0;
          }
        },
        newPassword: {
          required() {
            // Only required if currentPassword field has a value.
            return component.currentPassword.value.length > 0;
          }
        }
      },
      messages: {
        firstName: {
          required: "What's your first name?"
        },
        lastName: {
          required: "What's your last name?"
        },
        emailAddress: {
          required: "Need an email address here.",
          email: "Is this email address correct?"
        },
        currentPassword: {
          required: "Need your current password if changing."
        },
        newPassword: {
          required: "Need your new password if changing."
        }
      },
      submitHandler() {
        component.handleSubmit();
      }
    });
  }

  getUserType(user) {
    const userToCheck = user;
    delete userToCheck.services.resume;
    const service = Object.keys(userToCheck.services)[0];
    return service === "password" ? "password" : "oauth";
  }

  handleSubmit() {
    const profile = {
      emailAddress: this.emailAddress.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value
        }
      }
    };

    Meteor.call("users.editProfile", profile, error => {
      if (error) {
        Bert.alert(error.reason, "danger");
      } else {
        Bert.alert("Profile updated!", "success");
      }
    });

    if (this.newPassword.value) {
      Accounts.changePassword(
        this.currentPassword.value,
        this.newPassword.value,
        error => {
          if (error) {
            Bert.alert(error.reason, "danger");
          } else {
            this.currentPassword.value = "";
            this.newPassword.value = "";
          }
        }
      );
    }
    this.props.history.push("/home");
  }

  renderPasswordUser(loading, user) {
    return !loading ? (
      <div>
        <Row>
          <Col md={7}>
            <FormGroup>
              <ControlLabel>First Name</ControlLabel>
              <input
                type="text"
                name="firstName"
                defaultValue={user.profile.name.first}
                ref={firstName => {
                  this.firstName = firstName;
                }}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Last Name</ControlLabel>
              <input
                type="text"
                name="lastName"
                defaultValue={user.profile.name.last}
                ref={lastName => {
                  this.lastName = lastName;
                }}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Email Address</ControlLabel>
              <input
                type="email"
                name="emailAddress"
                defaultValue={user.emails[0].address}
                ref={emailAddress => {
                  this.emailAddress = emailAddress;
                }}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Current Password</ControlLabel>
              <input
                type="password"
                name="currentPassword"
                ref={currentPassword => {
                  this.currentPassword = currentPassword;
                }}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>New Password</ControlLabel>
              <input
                type="password"
                name="newPassword"
                ref={newPassword => {
                  this.newPassword = newPassword;
                }}
                className="form-control"
              />
              <InputHint>Use at least six characters.</InputHint>
            </FormGroup>
            <Button type="submit" bsStyle="success">
              Save Profile
            </Button>
          </Col>
        </Row>
      </div>
    ) : (
      <div />
    );
  }

  renderProfileForm(loading, user) {
    return !loading ? (
      {
        password: this.renderPasswordUser
      }[this.getUserType(user)](loading, user)
    ) : (
      <div />
    );
  }

  render() {
    const { loading, user } = this.props;
    return (
      <div className="Profile">
        <Row>
          <Col mdOffset={1} xs={12} sm={6} md={5}>
            <h4 className="page-header">Edit Profile</h4>
            <form
              ref={form => {
                this.form = form;
              }}
              onSubmit={event => event.preventDefault()}
            >
              {this.renderProfileForm(loading, user)}
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

Profile.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default createContainer(() => {
  const subscription = Meteor.subscribe("users.editProfile");

  return {
    loading: !subscription.ready(),
    user: Meteor.user()
  };
}, Profile);
