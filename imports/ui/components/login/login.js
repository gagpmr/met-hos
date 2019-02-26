import { gql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import Avatar from "@material-ui/core/Avatar";
import { Bert } from "meteor/themeteorchef:bert";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Meteor } from "meteor/meteor";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    fontSize: 15
  },
  label: {
    fontSize: 19
  },
  input: {
    fontSize: 19
  }
});

const SIGN_IN_STATE = gql`
  query {
    email
    password
  }
`;

const handleChange = (e, client) => {
  const { name, value } = e.target;
  client.writeData({
    data: { [name]: value }
  });
};

const handleSubmit = (e, client) => {
  e.preventDefault();
  const state = client.readQuery({
    query: SIGN_IN_STATE
  });
  Meteor.loginWithPassword(state.email, state.password, error => {
    if (error) {
      Bert.alert(error.reason, "danger");
    } else {
      Bert.alert("Welcome back!", "success");
    }
  });
  client.writeData({
    data: { email: "", password: "" }
  });
};

const SignIn = ({ classes, client }) => {
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h3">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={e => handleSubmit(e, client)}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email" className={classes.label}>
              Email Address
            </InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="email"
              onChange={e => handleChange(e, client)}
              className={classes.input}
              autoFocus
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password" className={classes.label}>
              Password
            </InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              className={classes.input}
              onChange={e => handleChange(e, client)}
              autoComplete="current-password"
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </main>
  );
};

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

export default withApollo(withStyles(styles)(SignIn));
