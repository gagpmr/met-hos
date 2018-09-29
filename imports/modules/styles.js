const Center = {
  textAlign: "center"
};

const Left = {
  textAlign: "left"
};

const PaddingZero = {
  verticalAlign: "middle",
  padding: "0px"
};

const PaddingFour = {
  verticalAlign: "middle",
  padding: "4px"
};

const Bold = {
  fontWeight: "bold"
};

const Large = {
  fontSize: "18px"
};

const Larger = {
  fontSize: "16px"
};

const Normal = {
  fontSize: "14px"
};

const PaddingThree = {
  verticalAlign: "middle",
  padding: "3px"
};

export const Middle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  marginTop: "-50px",
  marginLeft: "-50px",
  width: "200px",
  height: "200px"
};

export const h4 = {
  verticalAlign: "middle",
  margin: "0px",
  textAlign: "center",
  padding: "3px",
  fontWeight: "bolder",
  color: "black"
};

export const PaginationRow = {
  verticalAlign: "middle",
  padding: "5px 0 0 0",
  textAlign: "center"
};

export const widthSixtyFive = {
  textAlign: "left",
  verticalAlign: "middle",
  padding: "4px",
  width: "65%"
};

// Resident Details Tables Header
export const TableHeader = {
  marginBottom: "0",
  borderTop: "0"
};

export const PrintTableBorder = Object.assign({}, Center, {
  border: "1px solid black"
});

export const PrintTableBorderBold = Object.assign({}, Center, Bold, {
  border: "1px solid black"
});

export const PrintMonthName = Object.assign({}, Center, Bold, {
  border: "1px solid black",
  fontSize: "200%"
});

// Padding Zero
export const PaddingZeroCenter = Object.assign({}, PaddingZero, Center);
export const PaddingZeroLeft = Object.assign({}, PaddingZero, Left);
export const WidthSixtyPaddingZeroLeft = Object.assign({}, PaddingZero, Left, {
  width: "60%"
});
export const WidthEightyPaddingZeroLeft = Object.assign({}, PaddingZero, Left, {
  width: "80%"
});

// Padding Four Styles
export const PaddingFourCenter = Object.assign({}, PaddingFour, Center);

export const PaddingFourCenterBold = Object.assign(
  {},
  PaddingFour,
  Center,
  Bold
);

export const PaddingFourCenterLargeBold = Object.assign(
  {},
  PaddingFour,
  Center,
  Bold,
  Large
);

export const WidthThreePaddingFourCenterBold = Object.assign(
  {},
  PaddingFour,
  Center,
  Bold,
  { width: "3%" }
);

export const WidthFivePaddingFourCenterBold = Object.assign(
  {},
  PaddingFour,
  Center,
  Bold,
  { width: "5%" }
);

export const WidthTenPaddingFourCenter = Object.assign(
  {},
  PaddingFour,
  Center,
  {
    width: "10%"
  }
);

export const WidthTwentyThreePaddingFourLeftBold = Object.assign(
  {},
  PaddingFour,
  Left,
  Bold,
  { width: "23%" }
);

export const WidthHundredPaddingThree = Object.assign({}, PaddingThree, Left, {
  width: "100%"
});

export const WidthSeventyFivePaddingFourCenterBold = Object.assign(
  {},
  PaddingFour,
  Center,
  Bold,
  { width: "75%" }
);

// Padding Three Styles
export const PaddingThreeLeft = Object.assign({}, PaddingThree, Left);
export const PaddingThreeCenter = Object.assign({}, PaddingThree, Center);
export const PaddingThreeLeftBold = Object.assign({}, PaddingThree, Left, Bold);
export const PaddingThreeCenterBold = Object.assign(
  {},
  PaddingThree,
  Center,
  Bold
);

export const PaddingThreeCenterLargeBold = Object.assign(
  {},
  PaddingThree,
  Center,
  Bold,
  Large
);

export const PaddingThreeLeftLargerBold = Object.assign(
  {},
  PaddingThree,
  Left,
  Larger,
  Bold
);

export const PaddingThreeCenterLargerBold = Object.assign(
  {},
  PaddingThree,
  Center,
  Bold,
  Larger
);

// Padding Three Width
export const WidthSevenPaddingThreeLeft = Object.assign(
  {},
  PaddingThree,
  Left,
  Normal,
  { width: "7%" }
);

export const WidthThirteenPaddingThreeLeft = Object.assign(
  {},
  PaddingThree,
  Left,
  Normal,
  { width: "13%" }
);

export const WidthHundredPaddingThreeLeftNormal = Object.assign(
  {},
  PaddingThree,
  Left,
  Normal,
  { width: "100%" }
);

export const WidthTwentyFivePaddingThreeCenter = Object.assign(
  {},
  PaddingThree,
  Center,
  Normal,
  { width: "25%" }
);

export const WidthTwentyPaddingThreeCenter = Object.assign(
  {},
  PaddingThree,
  Center,
  Normal,
  { width: "20%" }
);

export const WidthTwentySevenPaddingThreeLeft = Object.assign(
  {},
  PaddingThree,
  Left,
  Normal,
  { width: "27%" }
);

export const WidthFiftyPaddingThreeCenter = Object.assign(
  {},
  PaddingThree,
  Center,
  { width: "50%" }
);

export const WidthThirtyPaddingThreeCenter = Object.assign(
  {},
  PaddingThree,
  Center,
  { width: "30%" }
);

export const WidthThirtyFivePaddingThreeCenter = Object.assign(
  {},
  PaddingThree,
  Center,
  { width: "35%" }
);

// Padding Three Width Bold
export const WidthFifteenPaddingThreeLeftBold = Object.assign(
  {},
  PaddingThree,
  Left,
  Normal,
  Bold,
  { width: "15%" }
);

export const WidthTenPaddingThreeLeftBold = Object.assign(
  {},
  PaddingThree,
  Left,
  Normal,
  Bold,
  { width: "10%" }
);

export const WidthFifteenPaddingThreeCenterBoldLarger = Object.assign(
  {},
  PaddingThree,
  Center,
  Larger,
  Bold,
  { width: "15%" }
);
