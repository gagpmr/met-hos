import { Button, Col, ControlLabel, FormGroup, Row } from "react-bootstrap";

import { Bert } from "meteor/themeteorchef:bert";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import React from "react";
import validate from "../../../modules/validate";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        emailAddress: {
          required: true,
          email: true
        },
        password: {
          required: true
        }
      },
      messages: {
        emailAddress: {
          required: "Need an email address here.",
          email: "Is this email address correct?"
        },
        password: {
          required: "Need a password here."
        }
      },
      submitHandler() {
        component.handleSubmit();
      }
    });
  }

  handleSubmit() {
    Meteor.loginWithPassword(
      this.emailAddress.value,
      this.password.value,
      error => {
        if (error) {
          Bert.alert(error.reason, "danger");
        } else {
          Bert.alert("Welcome back!", "success");
        }
      }
    );
  }

  render() {
    return (
      <div className="Login">
        <Row>
          <Col md={12} lgOffset={1} lg={3}>
            <h4 className="page-header">Log In</h4>
            <form
              ref={form => (this.form = form)}
              onSubmit={event => event.preventDefault()}
            >
              <FormGroup>
                <ControlLabel>Email Address</ControlLabel>
                <input
                  type="email"
                  name="emailAddress"
                  ref={emailAddress => (this.emailAddress = emailAddress)}
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <input
                  type="password"
                  name="password"
                  ref={password => (this.password = password)}
                  className="form-control"
                />
              </FormGroup>
              <Button type="submit" bsStyle="success">
                Log In
              </Button>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired
};

export default Login;
