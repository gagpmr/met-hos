import { Button, Grid, Input, TextField } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import React, { Component } from "react";

import { Bert } from "meteor/themeteorchef:bert";
import { Meteor } from "meteor/meteor";
import Validator from "react-forms-validator";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    background: "black"
  },
  input: {
    fontSize: "25px"
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isFormValidationErrors: true,
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.isValidationError = this.isValidationError.bind(this);
    this.flag = true;
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    const { submitted } = this.state;
  }

  isValidationError(flag) {
    this.setState({ isFormValidationErrors: flag });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { email, password, isFormValidationErrors } = this.state;
    if (!isFormValidationErrors) {
      // you are ready to perform your action here like dispatch
      // let { dispatch, login } = this.props;
      // dispatch( login( { params:{},data:{ contact_no, password } } ) );
      Meteor.loginWithPassword(email, password, error => {
        if (error) {
          Bert.alert(error.reason, "danger");
        } else {
          Bert.alert("Welcome back!", "success");
        }
      });
    }
  }

  render() {
    const { email, password, submitted } = this.state;
    return (
      <Grid
        container
        justify="center"
        align="center"
        direction="column"
        spacing={0}
      >
        <Grid item md={4}>
          <form noValidate onSubmit={this.handleFormSubmit}>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              className={this.props.classes.input}
              value={email}
              onChange={this.handleChange}
            />
            <Validator
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted}
              reference={{ email }}
              validationRules={{
                required: true
              }}
              validationMessages={{
                required: "This field is required"
              }}
            />
            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              className={this.props.classes.input}
              value={password}
              onChange={this.handleChange}
            />
            <Validator
              isValidationError={this.isValidationError}
              isFormSubmitted={submitted}
              reference={{ password }}
              validationRules={{ required: true }}
              validationMessages={{ required: "This field is required" }}
            />
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleFormSubmit}
                margin="normal"
              >
                Sign In
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);
