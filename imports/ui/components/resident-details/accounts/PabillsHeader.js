import React from "react";
import * as Styles from "/imports/modules/styles.js";

const PaBillsHeader = () => {
  return (
    <tr>
      <td style={Styles.PaddingThreeCenterBold}>Sr</td>
      <td style={Styles.PaddingThreeCenterBold}>Span</td>
      <td style={Styles.PaddingThreeCenterBold}>R-Rent</td>
      <td style={Styles.PaddingThreeCenterBold}>Water</td>
      <td style={Styles.PaddingThreeCenterBold}>Electricity</td>
      <td style={Styles.PaddingThreeCenterBold}>Misc</td>
      <td style={Styles.PaddingThreeCenterBold}>H.Y.</td>
      <td style={Styles.PaddingThreeCenterBold}>Security</td>
      <td style={Styles.PaddingThreeCenterBold}>Total</td>
      <td colSpan="7" style={Styles.PaddingThreeCenterBold}>
        Actions
      </td>
    </tr>
  );
};

export default PaBillsHeader;
