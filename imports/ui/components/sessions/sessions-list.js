import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "../shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import { Session } from "./session.js";
import { withRouter } from "react-router-dom";

const Sessions = ({ history, sessions, client, refetch }) => {
  return (
    <span>
      <div className="row">
        <div className="col-md-offset-3 col-md-6">
          {sessions.map((element, index) => (
            <Session
              key={index}
              session={element}
              history={history}
              client={client}
              fetchSessions={refetch}
            />
          ))}
        </div>
      </div>
    </span>
  );
};

Sessions.propTypes = {
  sessions: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Styles.Middle}>
        <Loading />
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
  client: PropTypes.instanceOf(ApolloClient),
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
