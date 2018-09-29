import { PaddingThreeCenterBold } from "../../../../modules/styles";
import React from "react";

const PaBillsHeader = () => {
  return (
    <tr>
      <td style={PaddingThreeCenterBold}>Sr</td>
      <td style={PaddingThreeCenterBold}>Span</td>
      <td style={PaddingThreeCenterBold}>R-Rent</td>
      <td style={PaddingThreeCenterBold}>Water</td>
      <td style={PaddingThreeCenterBold}>Electricity</td>
      <td style={PaddingThreeCenterBold}>Misc</td>
      <td style={PaddingThreeCenterBold}>H.Y.</td>
      <td style={PaddingThreeCenterBold}>Security</td>
      <td style={PaddingThreeCenterBold}>Total</td>
      <td colSpan="7" style={PaddingThreeCenterBold}>
        Actions
      </td>
    </tr>
  );
};

export default PaBillsHeader;
