import {
  Middle,
  PaddingThreeCenter,
  PaddingThreeCenterLargeBold,
  TableHeader
} from "../../../../modules/styles";

import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import DuesListTrue from "./duesListTrue";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import RemoveResident from "../../shared/RemoveResident";
import Resident from "./resident";
import { gql } from "react-apollo";
import moment from "moment";

const RESIDENT_PA_DETAILS = gql`
  query($resId: String!) {
    residentPaDetails(resId: $resId)
  }
`;

const paDetails = (props, e) => {
  e.preventDefault();
  props.client
    .query({
      query: RESIDENT_PA_DETAILS,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.history.push(`/resident-pa-details/${props.resident._id}/`);
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const RESIDENT_SA_DETAILS = gql`
  query($resId: String!) {
    residentSaDetails(resId: $resId)
  }
`;

const saDetails = (props, e) => {
  e.preventDefault();
  props.client
    .query({
      query: RESIDENT_SA_DETAILS,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.history.push(`/resident-sa-details/${props.resident._id}/`);
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const RESIDENT_MC_DETAILS = gql`
  query($resId: String!) {
    residentMcDetails(resId: $resId)
  }
`;

const mcDetails = (props, e) => {
  e.preventDefault();
  props.client
    .query({
      query: RESIDENT_MC_DETAILS,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.history.push(`/resident-mc-details/${props.resident._id}/`);
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const CREATE_SA_DETAIL = gql`
  mutation($resId: ID!) {
    createSaDetail(resId: $resId)
  }
`;

const EDIT_SA_DETAIL = gql`
  query($detId: String!) {
    editSaDetail(detId: $detId)
  }
`;

const securityDetail = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: CREATE_SA_DETAIL,
      variables: {
        resId: props.resident._id
      }
    })
    .then(({ data }) => {
      props.client
        .query({
          query: EDIT_SA_DETAIL,
          variables: {
            detId: data.createSaDetail
          }
        })
        .then(() =>
          props.history.push(`/edit-sa-detail/${data.createSaDetail}`)
        );
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const AUTOGENERATE = gql`
  mutation {
    dateAutoGenerate
  }
`;

const enableGenerate = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: AUTOGENERATE
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
      Bert.alert("Effective Date Updated!", "success");
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const UPDATE_DATE = gql`
  mutation($effectiveDate: String!) {
    updateDate(effectiveDate: $effectiveDate)
  }
`;

const saveToday = (props, e) => {
  e.preventDefault();
  const now = moment.utc().utcOffset(+5.5);
  const actualDate = now.format("DD-MMM-YYYY");
  props.client
    .mutate({
      mutation: UPDATE_DATE,
      variables: {
        effectiveDate: actualDate
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
      Bert.alert("Effective Date Updated!", "success");
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const SIX_MONTHS = gql`
  mutation($resId: String!) {
    sixMonths(resId: $resId)
  }
`;

const sixMonths = (props, e) => {
  e.preventDefault();
  if (props.resident.RollNumber.includes("-D")) {
    Bert.alert("Daily Student!", "danger");
  } else {
    props.client
      .mutate({
        mutation: SIX_MONTHS,
        variables: {
          resId: props.resident._id
        }
      })
      .then(() => {
        props.client.resetStore();
        props.fetchResident;
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }
};

const ADMISSION_DETAILS = gql`
  query($resId: String!) {
    admissionDetails(resId: $resId)
  }
`;

const admissionDetails = (props, e) => {
  e.preventDefault();
  props.client
    .query({
      query: ADMISSION_DETAILS,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.history.push(`/admission-details/${props.resident._id}`);
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

export const Actions = props => {
  if (!props.loadingResident) {
    return (
      <div className="row">
        <div className="col-md-12">
          <table
            style={TableHeader}
            className="table table-bordered table-condensed table-striped"
          >
            <thead>
              <tr>
                <th style={PaddingThreeCenterLargeBold} colSpan="12">
                  <Resident resident={props.resident} />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={PaddingThreeCenter}>
                  <a
                    target="_blank"
                    onClick={e => securityDetail(props, e)}
                    href=""
                  >
                    Create Security Detail
                  </a>
                </td>
                <td style={PaddingThreeCenter}>
                  Effective-Date: {props.date.EffectiveDateStr}
                </td>
                <td style={PaddingThreeCenter}>
                  <a onClick={e => enableGenerate(props, e)} href="">
                    Effective Date-Auto
                  </a>
                </td>
                <td style={PaddingThreeCenter}>
                  <a onClick={e => saveToday(props, e)} href="">
                    Effective Date-Today
                  </a>
                </td>
                <td style={PaddingThreeCenter}>
                  <RemoveResident
                    resident={props.resident}
                    loading={props.loadingResident}
                    callingComponent="ResidentDetails"
                  />
                </td>
                <td colSpan="2" style={PaddingThreeCenter}>
                  Dues List:{" "}
                  {props.resident.DuesList
                    ? props.resident.DuesList.toString()
                    : "false"}
                </td>
              </tr>
              <tr>
                <td style={PaddingThreeCenter}>
                  <a target="_blank" onClick={e => paDetails(props, e)} href="">
                    Private Account Details
                  </a>
                </td>
                <td style={PaddingThreeCenter}>
                  <a target="_blank" onClick={e => mcDetails(props, e)} href="">
                    Mess Canteen Details
                  </a>
                </td>
                <td style={PaddingThreeCenter}>
                  <a target="_blank" onClick={e => saDetails(props, e)} href="">
                    Security Account Details
                  </a>
                </td>
                <td style={PaddingThreeCenter}>
                  <a target="_blank" onClick={e => sixMonths(props, e)} href="">
                    Six Months
                  </a>
                </td>
                <td style={PaddingThreeCenter}>
                  <a
                    target="_blank"
                    onClick={e => admissionDetails(props, e)}
                    href=""
                  >
                    Admission Details
                  </a>
                </td>
                <td style={PaddingThreeCenter}>
                  <DuesListTrue
                    resident={props.resident}
                    fetchResident={props.fetchResident}
                    client={props.client}
                  />
                </td>
                <td style={PaddingThreeCenter}>
                  <Link target="_blank" to={"/dues-regular-residents"}>
                    Dues List - View
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return null;
};

Actions.propTypes = {
  resident: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchResident: PropTypes.func.isRequired,
  loadingResident: PropTypes.bool.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};
