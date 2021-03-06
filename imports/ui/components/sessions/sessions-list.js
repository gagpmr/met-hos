import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { Middle } from "../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import { Session } from "./session";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

const Sessions = ({ history, sessions, client, refetch }) => {
  return (
    <span>
      <div className="row">
        <div className="col-md-offset-3 col-md-6">
          {sessions.map(element => (
            <Session key={element._id} session={element} history={history} client={client} fetchSessions={refetch} />
          ))}
        </div>
      </div>
    </span>
  );
};

Sessions.propTypes = {
  sessions: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  refetch: PropTypes.func.isRequired
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
    <Sessions
      loading={props.loading}
      sessions={props.sessions}
      client={props.client}
      refetch={props.refetch}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  sessions: []
};

const SESSIONS = gql`
  query {
    sessions
  }
`;

export default graphql(SESSIONS, {
  props: ({ data: { loading, sessions, refetch } }) => ({
    loading,
    sessions,
    refetch
  }),
  forceFetch: true
})(withRouter(withApollo(FormatData)));
