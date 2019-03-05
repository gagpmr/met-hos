import gql from "graphql-tag";

const updateMcBill = gql`
  mutation(
    $billType: String!
    $resId: String!
    $billId: String!
    $isPaid: Boolean!
    $messOne: String!
    $messTwo: String!
    $canteen: Int!
    $amenity: String!
    $halfYearly: Int!
    $hasMessFine: Boolean!
    $hasCanteenFine: Boolean!
    $billPeriod: String!
  ) {
    updateMcBill(
      billType: $billType
      resId: $resId
      billId: $billId
      isPaid: $isPaid
      messOne: $messOne
      messTwo: $messTwo
      canteen: $canteen
      amenity: $amenity
      halfYearly: $halfYearly
      hasMessFine: $hasMessFine
      hasCanteenFine: $hasCanteenFine
      billPeriod: $billPeriod
    )
  }
`;

const updateMcBillType = gql`
  mutation($id: String!, $billType: String!, $billId: String!) {
    updateMcBillType(id: $id, billType: $billType, billId: $billId)
  }
`;

const gqls = {
  updateMcBill,
  updateMcBillType
};

export default gqls;
