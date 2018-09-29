import { PaddingThreeCenterBold } from "../../../../modules/styles";
import React from "react";

const McBillsHeader = () => {
  return (
    <tr>
      <td style={PaddingThreeCenterBold}>Sr</td>
      <td style={PaddingThreeCenterBold}>Span</td>
      <td style={PaddingThreeCenterBold}>Mess-1</td>
      <td style={PaddingThreeCenterBold}>Mess-2</td>
      <td style={PaddingThreeCenterBold}>M-Fine</td>
      <td style={PaddingThreeCenterBold}>Canteen</td>
      <td style={PaddingThreeCenterBold}>Can-Fine</td>
      <td style={PaddingThreeCenterBold}>Amenity</td>
      <td style={PaddingThreeCenterBold}>H.Y.</td>
      <td style={PaddingThreeCenterBold}>H.Y. Fine</td>
      <td style={PaddingThreeCenterBold}>Total</td>
      <td colSpan="7" style={PaddingThreeCenterBold}>
        Actions
      </td>
    </tr>
  );
};

export default McBillsHeader;
