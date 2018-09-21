import * as Styles from "/imports/modules/styles.js";

import { Link } from "react-router-dom";
import React from "react";
import { chunk } from "lodash";

const empty = { Link: "", Value: "", isEmpty: true };

const getArrays = () => {
  const items = [];
  items.push({ Link: "/rooms", Value: "Rooms", isEmpty: false });
  items.push({ Link: "/resident", Value: "Add Resident", isEmpty: false });
  items.push({ Link: "/holidays", Value: "Holidays", isEmpty: false });
  items.push({ Link: "/classes", Value: "Classes", isEmpty: false });
  items.push({ Link: "/sessions", Value: "Hostel Sessions", isEmpty: false });
  items.push({
    Link: "/effective-date",
    Value: "Effective Date",
    isEmpty: false
  });
  items.push({
    Link: "/mes-can-fine",
    Value: "Mess Canteen Fine",
    isEmpty: false
  });
  items.push({
    Link: "/pri-acc-fine",
    Value: "Private Account Fine",
    isEmpty: false
  });
  items.push({
    Link: "/dues-regular-residents",
    Value: "Dues Regular Resident",
    isEmpty: false
  });
  items.push({
    Link: "/notice-list",
    Value: "Notice Board Residents List",
    isEmpty: false
  });
  items.push({ Link: "/residents", Value: "All Residents", isEmpty: false });
  items.push({
    Link: "/residents-room-wise",
    Value: "Residents (Current) Room Wise",
    isEmpty: false
  });

  items.push({
    Link: "/pa-collections/1",
    Value: "Private A/c Collections",
    isEmpty: false
  });
  items.push({
    Link: "/mc-collections/1",
    Value: "Mess Canteen A/c Collections",
    isEmpty: false
  });
  items.push({
    Link: "/sa-collections/1",
    Value: "Security A/c Collections",
    isEmpty: false
  });
  items.push({
    Link: "/profile",
    Value: "Profile",
    isEmpty: false
  });
  items.push(empty);
  items.push({
    Link: "/pa-month-collections/1",
    Value: "Pa A/c Monthly Collections",
    isEmpty: false
  });
  items.push({
    Link: "/mc-month-collections/1",
    Value: "Mc A/c Monthly Collections",
    isEmpty: false
  });
  items.push({
    Link: "/sa-month-collections/1",
    Value: "Sa A/c Monthly Collections",
    isEmpty: false
  });
  const chunks = chunk(items, 5);
  return chunks;
};

const TableCell = ({ cell }) => {
  if (cell.isEmpty) {
    return <td style={Styles.WidthTwentyPaddingThreeCenter}>&nbsp;</td>;
  }
  return (
    <td style={Styles.WidthTwentyPaddingThreeCenter}>
      <Link target="_blank" to={cell.Link}>
        {cell.Value}
      </Link>
    </td>
  );
};

const TableRow = ({ cells }) => {
  return (
    <tr>{cells.map((cell, index) => <TableCell key={index} cell={cell} />)}</tr>
  );
};

const Home = () => {
  const rows = getArrays();
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-bordered table-condensed table-striped">
          <thead>
            <tr>
              <th style={Styles.PaddingThreeCenterLargeBold} colSpan="5">
                Home
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => <TableRow key={index} cells={item} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
