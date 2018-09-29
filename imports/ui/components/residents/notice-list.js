import {
  Middle,
  PaddingFourCenter,
  PaddingFourCenterBold,
  PaddingFourCenterLargeBold
} from "../../../modules/styles";
import { compose, gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { Loading } from "../shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

class NoticeDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NoticeDate: moment.utc(props.noticeDate, "DD-MM-YYYY")
    };
    this.change = this.change.bind(this);
  }

  change(date) {
    this.setState({ NoticeDate: date });
  }

  render() {
    return (
      <DatePicker
        autoFocus
        tabIndex={1}
        dateFormat="DD-MM-YYYY"
        selected={this.state.NoticeDate}
        onChange={this.change}
      />
    );
  }
}

NoticeDate.propTypes = {
  noticeDate: PropTypes.string.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

NoticeDate.defaultProps = {
  noticeDate: moment().format("DD-MM-YYYY")
};

const NOTICE_LIST_FALSE = gql`
  mutation($resId: String!) {
    noticeListFalse(resId: $resId)
  }
`;

const noticeListRemove = (props, e) => {
  e.preventDefault();
  const resId = e.currentTarget.dataset.resid;
  props.client
    .mutate({
      mutation: NOTICE_LIST_FALSE,
      variables: {
        resId
      }
    })
    .then(() => {
      Bert.alert("Notice List - Resident Removed!", "success");
      props.client.resetStore();
      props.refetch;
    })
    .catch(error => {
      Bert.alert(error, "danger");
      console.log("there was an error", error);
    });
  return true;
};

const NOTICE_LIST = gql`
  query {
    noticeList {
      _id
      Name
      Class {
        Value
      }
      Room {
        Value
      }
      RollNumber
      UnpaidMcTotal
      UnpaidPaTotal
      UnpaidTotal
    }
  }
`;

const print = (props, e) => {
  e.preventDefault();
  props.client
    .query({
      query: NOTICE_LIST
    })
    .then(() => {
      props.history.push(`/notice-list-print`);
    })
    .catch(error => {
      Bert.alert(error, "danger");
      console.log("there was an error", error);
    });
  return true;
};

const renderList = props => (
  <div className="row">
    <div className="col-md-8 col-md-offset-2">
      <table className="table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th style={PaddingFourCenterLargeBold} colSpan="20">
              Notice Board List &nbsp;
              <a onClick={e => print(props, e)} href="">
                <i className="fa fa-print" aria-hidden="true" />
              </a>
            </th>
          </tr>
          {/* <tr>
            <td colSpan="20" style={PaddingFourCenterBold}>
              Pay By Date: <NoticeDate client={props.client} />
            </td>
          </tr> */}
          <tr>
            <td style={PaddingFourCenterBold}>Sr.</td>
            <td style={PaddingFourCenterBold}>Room</td>
            <td style={PaddingFourCenterBold}>R.No.</td>
            <td style={PaddingFourCenterBold}>Name</td>
            <td style={PaddingFourCenterBold}>Mess Canteen</td>
            <td style={PaddingFourCenterBold}>Hostel</td>
            <td style={PaddingFourCenterBold}>Total</td>
            <td colSpan="2" style={PaddingFourCenterBold}>
              Do
            </td>
          </tr>
        </thead>
        <tbody>
          {props.residents.map((resident, index) => (
            <tr key={resident._id}>
              <td style={PaddingFourCenterBold}>{index + 1}</td>
              <td style={PaddingFourCenter}>{resident.Room.Value}</td>
              <td style={PaddingFourCenter}>{resident.RollNumber}</td>
              <td style={PaddingFourCenter}>{resident.Name}</td>
              <td style={PaddingFourCenterBold}>
                {resident.UnpaidMcTotal.Total}
              </td>
              <td style={PaddingFourCenterBold}>
                {resident.UnpaidPaTotal.Total}
              </td>
              <td style={PaddingFourCenterBold}>{resident.UnpaidTotal}</td>
              <td style={PaddingFourCenterBold}>
                <a
                  data-resid={resident._id}
                  onClick={e => noticeListRemove(props, e)}
                  href=""
                >
                  <i className="fa fa-times" aria-hidden="true" />
                </a>
              </td>
              <td style={PaddingFourCenterBold}>
                <Link target="_blank" to={`/resident-details/${resident._id}`}>
                  <i className="fa fa-user-circle" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const NoticeList = props => {
  return renderList(props);
};

NoticeList.propTypes = {
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  residents: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Class: PropTypes.shape({
        Value: PropTypes.string.isRequired
      }),
      Room: PropTypes.shape({
        Value: PropTypes.string.isRequired
      }),
      RollNumber: PropTypes.string.isRequired,
      UnpaidMcTotal: PropTypes.object.isRequired,
      UnpaidPaTotal: PropTypes.object.isRequired
    })
  )
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <NoticeList
      loading={props.loading}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
      residents={props.noticeList}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  noticeList: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  noticeList: []
};

export default compose(
  graphql(NOTICE_LIST, {
    props: ({ data: { loading, noticeList, refetch } }) => ({
      loading,
      noticeList,
      refetch
    }),
    forceFetch: true
  })
)(withApollo(FormatData));
