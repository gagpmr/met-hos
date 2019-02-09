import {
  PaddingThreeCenterLargeBold,
  PaddingThreeLeft,
  PaddingThreeLeftBold,
  WidthTenPaddingThreeLeftBold,
  WidthThirteenPaddingThreeLeft,
  WidthTwentySevenPaddingThreeLeft
} from "../../../../modules/styles";

import { Link } from "react-router-dom";
import Modal from "react-modal";
import PropTypes from "prop-types";
import React from "react";

const customStyles = {
  content: {
    top: "35%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "75%",
    overflowX: "hidden",
    transform: "translate(-50%, -50%)",
    padding: 0
  }
};

class Resident extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    // this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(e) {
    e.preventDefault();
    this.setState({ modalIsOpen: true });
  }

  // afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   this.subtitle.style.color = "#f00";
  // }

  closeModal(e) {
    e.preventDefault();
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div>
        {this.props.resident.Name} - {this.props.resident.RollNumber} &nbsp;
        <a target="_blank" onClick={this.openModal} href="">
          <i className="fa fa-id-badge fa-sm" aria-hidden="true" />
        </a>
        &nbsp; &nbsp;
        <Link to={`/resident/${this.props.resident._id}`}>
          <i className="fa fa-pencil-square-o" />
        </Link>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
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
                      &nbsp; S/o {this.props.resident.FatherName} &nbsp;
                      <Link to={`/resident/${this.props.resident._id}`}>
                        <i className="fa fa-pencil-square-o" />
                      </Link>
                      <a
                        onClick={this.closeModal}
                        href=""
                        style={{ float: "right", marginRight: "10px" }}
                      >
                        <i className="fa fa-times fa-lg" aria-hidden="true" />
                      </a>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={WidthTenPaddingThreeLeftBold}>Roll Number</td>
                    <td style={WidthThirteenPaddingThreeLeft}>
                      {this.props.resident.RollNumber}
                    </td>
                    <td style={WidthTenPaddingThreeLeftBold}>Tel Num</td>
                    <td style={WidthTwentySevenPaddingThreeLeft}>
                      {this.props.resident.TelephoneNumber}
                    </td>
                    <td style={WidthTenPaddingThreeLeftBold}>Category</td>
                    <td style={WidthTwentySevenPaddingThreeLeft}>
                      {this.props.resident.Category.Value}
                    </td>
                  </tr>
                  <tr>
                    <td style={PaddingThreeLeftBold}>Room</td>
                    <td style={PaddingThreeLeft}>
                      {this.props.resident.Room.Value}
                    </td>
                    <td style={PaddingThreeLeftBold}>Class</td>
                    <td style={PaddingThreeLeft} colSpan="5">
                      {this.props.resident.Class.Value}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

Resident.prototypes = {
  resident: PropTypes.object
};

export default Resident;
