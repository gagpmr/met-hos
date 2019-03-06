import { Middle, PaddingThreeCenterBold } from "../../../modules/styles";
import { gql, graphql } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import { _ } from "underscore";

class PriAccFine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Fine: props.latestFine,
      BillPeriod: props.latestMonth
    };
    this.getFine = this.getFine.bind(this);
    this.refresh = this.refresh.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getFine(value) {
    const fine = _.first(
      _.filter(this.props.fines, item => item.PaMonth === value)
    );
    this.setState({ Fine: fine.Pa });
  }

  refresh() {
    this.props.client.resetStore();
    this.props.refetch;
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    this.getFine(value);
  }

  render() {
    return (
      <div className="col-md-4 col-md-offset-4">
        <table className="table table-bordered table-condensed table-striped">
          <thead>
            <tr>
              <th colSpan="3" className="text-center h4">
                <strong>Private Account Fine &nbsp;</strong>
                <a id="refresh" onClick={e => this.refresh(e)} href="">
                  <i className="fa fa-refresh" aria-hidden="true" />
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-center mes-can-fine">Effective Date</th>
              <td className="text-center">{this.props.date}</td>
            </tr>
            <tr>
              <th className="text-center mes-can-fine">Bill Month</th>
              <td className="text-center">
                <select
                  autoFocus
                  value={this.state.BillPeriod}
                  onChange={this.handleChange}
                  name="BillPeriod"
                >
                  {this.props.months.map((element, index) => (
                    <option key={index} value={element.Value}>
                      {element.Value}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <th className="text-center mes-can-fine">Fine</th>
              <td style={PaddingThreeCenterBold}>{this.state.Fine}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

PriAccFine.propTypes = {
  loading: PropTypes.bool.isRequired,
  fines: PropTypes.array.isRequired,
  months: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  latestMonth: PropTypes.string.isRequired,
  latestFine: PropTypes.number.isRequired
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
    <PriAccFine
      loading={props.loading}
      fines={props.priAccFine.fines}
      months={props.priAccFine.months}
      client={props.client}
      date={props.priAccFine.date.EffectiveDateStr}
      latestFine={props.priAccFine.latestFine.Pa}
      latestMonth={props.priAccFine.latestMonth.Value}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  priAccFine: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  priAccFine: {
    date: {
      EffectiveDateStr: ""
    },
    latestFine: {
      Pa: 0
    },
    latestMonth: {
      Value: 0
    }
  }
};

const PRI_ACC_FINE = gql`
  query {
    priAccFine
  }
`;

export default graphql(PRI_ACC_FINE, {
  props: ({ data: { loading, priAccFine, refetch } }) => ({
    loading,
    priAccFine,
    refetch
  }),
  forceFetch: true
})(FormatData);
