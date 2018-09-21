import * as Styles from "../../../modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Class } from "./class.js";
import { Loading } from "../shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";

const Classes = props => {
  if (props.loading) {
    return (
      <div style={Styles.Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-bordered table-condensed table-striped">
          <thead>
            <tr>
              <td style={Styles.PaddingThreeCenterLargeBold} colSpan="9">
                Classes
              </td>
            </tr>
          </thead>
          <tbody>
            {props.classes.map((element, index) => (
              <Class
                key={index}
                clas={element}
                client={props.client}
                fetchClasses={props.refetch}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Classes.defaultProps = {
  classes: []
};

Classes.propTypes = {
  loading: PropTypes.bool.isRequired,
  classes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Value: PropTypes.string.isRequired
    })
  ).isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired
};

const CLASSES = gql`
  query {
    classes {
      _id
      Value
      SrNo
      Focus
    }
  }
`;

export default graphql(CLASSES, {
  props: ({ data: { loading, classes, refetch } }) => ({
    loading,
    classes,
    refetch
  })
})(withApollo(Classes));
