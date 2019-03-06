import {
  Middle,
  PaddingFourCenter,
  PaddingFourCenterBold,
  WidthFivePaddingFourCenterBold,
  WidthSeventyFivePaddingFourCenterBold
} from "../../../modules/styles";

import ApolloClient from "apollo-client";
import { Link } from "react-router-dom";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";

const REMOVE_CLASS = gql`
  mutation($classId: String!) {
    removeClass(classId: $classId)
  }
`;

const INSERT_CLASS = gql`
  mutation($classId: String!, $srNo: Int!) {
    insertClass(classId: $classId, srNo: $srNo)
  }
`;

const SRNO_DOWN = gql`
  mutation($classId: String!, $srNo: Int!) {
    srNoDown(classId: $classId, srNo: $srNo)
  }
`;

const SRNO_UP = gql`
  mutation($classId: String!, $srNo: Int!) {
    srNoUp(classId: $classId, srNo: $srNo)
  }
`;

const SRNO_MAX = gql`
  mutation($classId: String!, $srNo: Int!) {
    srNoMax(classId: $classId, srNo: $srNo)
  }
`;

export class Class extends React.Component {
  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
    this.insert = this.insert.bind(this);
    this.srnodown = this.srnodown.bind(this);
    this.srnoup = this.srnoup.bind(this);
    this.srnomax = this.srnomax.bind(this);
  }

  componentDidMount() {
    if (this.props.clas !== undefined) {
      if (this.props.clas.Focus) {
        this.node.scrollIntoView();
      }
    }
  }

  remove(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: REMOVE_CLASS,
        variables: {
          classId: e.currentTarget.dataset.classid
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchClasses;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  insert(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: INSERT_CLASS,
        variables: {
          classId: e.currentTarget.dataset.classid,
          srNo: e.currentTarget.dataset.srno
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchClasses;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  srnodown(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: SRNO_DOWN,
        variables: {
          classId: e.currentTarget.dataset.classid,
          srNo: e.currentTarget.dataset.srno
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchClasses;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  srnoup(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: SRNO_UP,
        variables: {
          classId: e.currentTarget.dataset.classid,
          srNo: e.currentTarget.dataset.srno
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchClasses;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  srnomax(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: SRNO_MAX,
        variables: {
          classId: e.currentTarget.dataset.classid,
          srNo: e.currentTarget.dataset.srno
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.fetchClasses;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  render() {
    if (this.props.loading) {
      return (
        <div style={Middle}>
          <MDSpinner />
        </div>
      );
    }
    return (
      // eslint-disable-next-line no-return-assign
      <tr ref={node => (this.node = node)} id={this.props.detail._id} className="text-left">
        <td style={WidthFivePaddingFourCenterBold}>{this.props.clas.SrNo}</td>
        <td style={PaddingFourCenterBold}>
          <a
            id="add-class"
            onClick={this.insert}
            data-srno={this.props.clas.SrNo}
            data-classid={this.props.clas._id}
            data-toggle="tooltip"
            title="Add Class"
            href=""
          >
            <i className="fa fa-plus" aria-hidden="true" />
            <span />
          </a>
        </td>
        <td style={PaddingFourCenter}>
          <a
            data-toggle="tooltip"
            onClick={this.srnodown}
            data-classid={this.props.clas._id}
            data-srno={this.props.clas.SrNo}
            title="Serial Number Decrease"
            href=""
          >
            <i className="fa fa-arrow-circle-up" aria-hidden="true" />
          </a>
        </td>
        <td style={PaddingFourCenter}>
          <a
            id="sr-no-up"
            onClick={this.srnoup}
            data-srno={this.props.clas.SrNo}
            data-classid={this.props.clas._id}
            data-toggle="tooltip"
            title="Serial Number Increase"
            href=""
          >
            <i className="fa fa-arrow-circle-down" aria-hidden="true" />
          </a>
        </td>
        <td style={PaddingFourCenter}>
          <a
            onClick={this.srnomax}
            data-classid={this.props.clas._id}
            data-srno={this.props.clas.SrNo}
            data-toggle="tooltip"
            title="Serial Number Maximum"
            href=""
          >
            <i className="fa fa-long-arrow-down" aria-hidden="true" />
          </a>
        </td>
        <td style={PaddingFourCenter}>
          <Link data-toggle="tooltip" title="Edit Class" to={`/edit-class/${this.props.clas._id}`}>
            <i className="fa fa-pencil-square-o" />
          </Link>
        </td>
        <td style={PaddingFourCenter}>
          <a
            onClick={this.remove}
            data-classid={this.props.clas._id}
            data-toggle="tooltip"
            title="Delete Class"
            href=""
          >
            <i className="fa fa-trash-o" aria-hidden="true" />
          </a>
        </td>
        <td style={WidthSeventyFivePaddingFourCenterBold}>{this.props.clas.Value}</td>
      </tr>
    );
  }
}

Class.defaultProps = {
  clas: {}
};

Class.propTypes = {
  clas: PropTypes.object,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  fetchClasses: PropTypes.func.isRequired
};
