import {
  PaddingThreeCenterLargeBold,
  PaddingThreeLeft,
  PaddingThreeLeftBold,
  WidthTenPaddingThreeLeftBold,
  WidthThirteenPaddingThreeLeft,
  WidthTwentySevenPaddingThreeLeft
} from "../../../modules/styles";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

export class ResidentInfo extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <table
            style={{
              marginBottom: "0"
            }}
            className="table table-bordered table-condensed table-striped"
          >
            <thead>
              <tr>
                <th style={PaddingThreeCenterLargeBold} colSpan="6">
                  {this.props.resident.Name}
                  &nbsp; S/o {this.props.resident.FatherName}
                  &nbsp;
                  <Link to={`/resident/${this.props.resident._id}`}>
                    <i className="fa fa-pencil-square-o" />
                  </Link>
                  &nbsp;
                  <Link to={`/`}>
                    <i className="fa fa-home" aria-hidden="true" />
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={WidthTenPaddingThreeLeftBold}>Roll Number</td>
                <td style={WidthThirteenPaddingThreeLeft}>
                  <Link to={`/resident/${this.props.resident._id}`}>
                    {this.props.resident.RollNumber}
                  </Link>
                </td>
                <td style={WidthTenPaddingThreeLeftBold}>Tel Num</td>
                <td style={WidthTwentySevenPaddingThreeLeft}>
                  <Link to={`/resident/${this.props.resident._id}`}>
                    {this.props.resident.TelephoneNumber}
                  </Link>
                </td>
                <td style={WidthTenPaddingThreeLeftBold}>Category</td>
                <td style={WidthTwentySevenPaddingThreeLeft}>
                  <Link to={`/resident/${this.props.resident._id}`}>
                    {this.props.resident.Category.Value}
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={PaddingThreeLeftBold}>Room</td>
                <td style={PaddingThreeLeft}>
                  <Link to={`/resident/${this.props.resident._id}`}>
                    {this.props.resident.Room.Value}
                  </Link>
                </td>
                <td style={PaddingThreeLeftBold}>Class</td>
                <td style={PaddingThreeLeft} colSpan="5">
                  <Link to={`/resident/${this.props.resident._id}`}>
                    {this.props.resident.Class.Value}
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

ResidentInfo.propTypes = {
  resident: PropTypes.object
};
