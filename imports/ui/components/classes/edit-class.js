import {
  Middle,
  PaddingFourCenterLargeBold,
  PaddingZeroCenter,
  WidthFifteenPaddingThreeCenterBoldLarger,
  WidthHundredPaddingThreeLeftNormal
} from "../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import $ from "jquery";
import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

const UPDATE_CLASS = gql`
  mutation($classId: String!, $value: String!) {
    updateClass(classId: $classId, value: $value)
  }
`;

export class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = null;
    this.submitForm = this.submitForm.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  componentDidMount() {
    this.field.select();
  }

  submitForm(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: UPDATE_CLASS,
        variables: {
          classId: this.props.clas._id,
          value: $("#class-value").val()
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.history.push("/classes");
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-10 col-md-offset-1">
          <table className="table table-bordered table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="2" style={PaddingFourCenterLargeBold}>
                  Edit Class
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={WidthFifteenPaddingThreeCenterBoldLarger}>Class Name</td>
                <td style={PaddingZeroCenter}>
                  <input
                    id="class-value"
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    ref={input => {
                      this.field = input;
                    }}
                    style={WidthHundredPaddingThreeLeftNormal}
                    onKeyDown={this.keyPressed}
                    type="text"
                    defaultValue={this.props.clas.Value}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center" colSpan="2 ">
                  <a onClick={this.submitForm} href="">
                    Save
                  </a>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

EditClass.propTypes = {
  clas: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
      </div>
    );
  }
  return (
    <EditClass
      loading={props.loading}
      clas={props.editClass}
      client={props.client}
      history={props.history}
      refetch={props.refetch}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editClass: PropTypes.object,
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

FormatData.defaultProps = {
  editClass: {}
};

const EDIT_CLASS = gql`
  query($classId: String!) {
    editClass(classId: $classId) {
      _id
      Value
    }
  }
`;

export default graphql(EDIT_CLASS, {
  props: ({ data: { loading, editClass, refetch } }) => ({
    loading,
    editClass,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      classId: ownProps.match.params.classId
    }
  })
})(withRouter(withApollo(FormatData)));
