import { gql } from "react-apollo";

const updatePaBill = gql`
  mutation(
    $billType: String!
    $resId: String!
    $billId: String!
    $startDate: String!
    $endDate: String!
    $electricity: Int!
    $billPeriod: String!
    $misc: Int!
    $roomRent: Int!
    $security: Int!
    $halfYearly: Int!
  ) {
    updatePaBill(
      billType: $billType
      resId: $resId
      billId: $billId
      startDate: $startDate
      endDate: $endDate
      electricity: $electricity
      billPeriod: $billPeriod
      misc: $misc
      roomRent: $roomRent
      security: $security
      halfYearly: $halfYearly
    )
  }
`;

const updatePaBillType = gql`
  mutation($id: String!, $billType: String!, $billId: String!) {
    updatePaBillType(id: $id, billType: $billType, billId: $billId)
  }
`;

const gqls = {
  updatePaBill,
  updatePaBillType
};

export default gqls;
