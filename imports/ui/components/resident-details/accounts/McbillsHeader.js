import React from "react";
import * as Styles from "/imports/modules/styles.js";

const McBillsHeader = () => {
  return (
    <tr>
      <td style={Styles.PaddingThreeCenterBold}>Sr</td>
      <td style={Styles.PaddingThreeCenterBold}>Span</td>
      <td style={Styles.PaddingThreeCenterBold}>Mess-1</td>
      <td style={Styles.PaddingThreeCenterBold}>Mess-2</td>
      <td style={Styles.PaddingThreeCenterBold}>M-Fine</td>
      <td style={Styles.PaddingThreeCenterBold}>Canteen</td>
      <td style={Styles.PaddingThreeCenterBold}>Can-Fine</td>
      <td style={Styles.PaddingThreeCenterBold}>Amenity</td>
      <td style={Styles.PaddingThreeCenterBold}>H.Y.</td>
      <td style={Styles.PaddingThreeCenterBold}>H.Y. Fine</td>
      <td style={Styles.PaddingThreeCenterBold}>Total</td>
      <td colSpan="7" style={Styles.PaddingThreeCenterBold}>
        Actions
      </td>
    </tr>
  );
};

export default McBillsHeader;
