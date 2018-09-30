import { gql, makeExecutableSchema } from "apollo-server-express";

const jsonType = gql`
  scalar JSON
`;

const resDetailQuery = gql`
  type Query {
    admissionDetails(resId: String): JSON
    transactionDetails(mcDetId: String!, paDetId: String!): JSON
    residentMcDetails(resId: String!): JSON
  }
`;

const mcMonthQuery = gql`
  type Query {
    mcMonthlyPrint(monthId: String!): JSON
    mcMonthTotalsByPage(pageNo: Int!): JSON
  }
`;

const mcMonthMutation = gql`
  type Mutation {
    removeMcMonth(month: String!): String!
    autoDepositMcMonth(month: String!): String!
  }
`;

const mcDayQuery = gql`
  type Query {
    editMcDayTotal(detId: String!): JSON
    mcDayTotalsByPage(pageNo: Int!): JSON
  }
`;

const mcDayMutation = gql`
  type Mutation {
    removeMcDayTotal(depositDate: String!): String
    autoDepositMcDayTotal(id: ID!): String!
    updateMcDayTotal(detId: ID!, deposit: Int!): String
  }
`;

const queryType = gql`
  type Class {
    _id: ID!
    Value: String!
    SrNo: String!
    Focus: Boolean!
  }

  type Category {
    _id: ID!
    Value: String!
  }

  type Resident {
    _id: ID!
    Name: String!
    FatherName: String!
    RollNumber: String!
    TelephoneNumber: String!
    Class: Class
    Category: Category
    Room: Room
    McBills: [JSON]
    PaBills: [JSON]
    TxnPaBills: [JSON]
    TxnMcBills: [JSON]
    UnpaidMcTotal: JSON
    UnpaidPaTotal: JSON
    TxnTotal: Int!
    TxnMcTotal: Int!
    TxnPaTotal: Int!
    UnpaidTotal: Int!
    DuesList: Boolean
  }

  type Room {
    _id: ID!
    Value: String!
  }

  type Query {
    test(resId: String!): JSON
    editMcDetail(detId: String!): JSON
    mcDateDetails(date: String!): JSON
    residentPaDetails(resId: String!): JSON
    paMonthlyPrint(monthId: String!): JSON
    paMonthTotalsByPage(pageNo: Int!): JSON
    editPaDayTotal(detId: String!): JSON
    editPaDetail(detId: String!): JSON
    paDateDetails(date: String!): JSON
    paDayTotalsByPage(pageNo: Int!): JSON
    residentSaDetails(resId: String!): JSON
    saMonthlyPrint(monthId: String!): JSON
    saMonthTotalsByPage(pageNo: Int!): JSON
    saDateDetails(date: String!): JSON
    editClass(classId: String!): Class
    classes: [Class]
    holidays: JSON
    effectiveDate: JSON
    priAccFine: JSON
    mesCanFine: JSON
    editSaDayTotal(detId: String!): JSON
    editSession(sessId: String!): JSON
    sessions: JSON
    rooms: [Room]
    editResident(resId: String): JSON
    residents: [Resident]
    roomResidents(roomId: String!): JSON
    residentsRoomWise: JSON
    duesRegularResidents: JSON
    noticeList: [Resident]
    residentDetails(id: String!): JSON
    editPaBill(resId: String!, billId: String!): JSON
    editMcBill(resId: String!, billId: String!): JSON
    editSaDetail(detId: String!): JSON
    saDayTotalsByPage(pageNo: Int!): JSON
  }
`;

const mutationType = gql`
  type Mutation {
    updateMcDetail(
      detId: ID!
      receiptDate: String!
      depositDate: String!
      receiptNumber: String!
      studentName: String!
      roomNumber: String!
      rollNumber: String!
      monthName: String!
      messOne: Int!
      messTwo: Int!
      canteen: Int!
      fines: Int!
      amenity: Int!
      poorStuWelFund: Int!
      mcServantWelFund: Int!
      foodSubsidy: Int!
      celebrationFund: Int!
    ): String
    cancelledMcDetail(rNum: String!, date: String!): String!
    removeMcDetail(detId: String): String!
    copyEditMcDetail(detId: String!): String!
    removePaMonth(month: String!): String!
    autoDepositPaMonth(month: String!): String!
    removePaDayTotal(depositDate: String!): String
    autoDepositPaDayTotal(id: ID!): String!
    updatePaDayTotal(detId: ID!, deposit: Int!): String
    updatePaDetail(
      detId: ID!
      receiptDate: String!
      depositDate: String!
      receiptNumber: String!
      name: String!
      roomNumber: String!
      rollNumber: String!
      roomRent: Int!
      waterCharges: Int!
      electricityCharges: Int!
      developmentFund: Int!
      rutineHstlMaintnceCharges: Int!
      miscellaneous: Int!
    ): String
    copyEditPaDetail(detId: String!): String!
    cancelledPaDetail(rNum: String!, date: String!): String!
    removePaDetail(detId: String): String!
    removeSaMonth(month: String!): String!
    autoDepositSaMonth(month: String!): String!
    cancelledSaDetail(rNum: String!, date: String!): String!
    removeSaDetail(detId: String): String!
    updateClass(classId: String!, value: String!): String!
    srNoMax(classId: String!, srNo: Int!): String!
    srNoUp(classId: String!, srNo: Int!): String!
    srNoDown(classId: String!, srNo: Int!): String!
    insertClass(classId: String!, srNo: Int!): String!
    removeClass(classId: String!): String!
    updateResident(
      resId: String
      name: String!
      fatherName: String!
      rollNumber: String!
      session: String!
      telephoneNumber: String!
      category: String!
      room: String!
      clas: String!
    ): JSON
    insertHoliday(date: String!): String!
    removeHoliday(id: ID!): String!
    copyEditSession(sessId: String!): String!
    updateSession(
      sessId: ID!
      srNo: Int!
      isCurrentSession: Boolean!
      value: String!
      suffix: String!
      hostelSecurity: Int!
      messSecurity: Int!
      canteenSecurity: Int!
      totalSecurity: Int!
      messAmenity: Int!
      canteenAmenity: Int!
      poorStuWelFund: Int!
      mcServantWelFund: Int!
      celebrationFund: Int!
      rutineHstlMaintnceCharges: Int!
      developmentFund: Int!
      continuationCharges: Int!
      dailyCharges: Int!
      roomRent: Int!
      waterCharges: Int!
      foodSubsidy: Int!
      electricityCharges: Int!
    ): String
    removeSession(sessId: String!): String
    sixMonths(resId: String!): String
    txnDetailBoth(resId: String!): JSON
    txnDetailPa(resId: String!): ID
    txnDetailMc(resId: String!): ID
    mcDetailBillAll(resId: String!): ID
    mcDetailBill(resId: String!, billType: String!, billId: String!): ID
    paDetailBillAll(resId: String!): ID
    paDetailBill(resId: String!, billType: String!, billId: String!): ID
    txnRemovePaBill(resId: String!, billId: String!): String
    txnAddPaBill(resId: String!, billId: String!): String
    txnAddAllPa(resId: String!): String
    txnAddAllMc(resId: String!): String
    txnRemoveAllPa(resId: String!): String
    txnRemoveAllMc(resId: String!): String
    txnRemoveMcBill(resId: String!, billId: String!): String
    txnAddMcBill(resId: String!, billId: String!): String
    dateAutoGenerate: String
    updateDate(effectiveDate: String!): String
    duesListTrue(id: String!): String
    duesListFalse(id: String!): String
    noticeListTrue(resId: String!): String
    noticeListFalse(resId: String!): String
    removeResident(resId: ID!): String
    createSaDetail(resId: ID!): String
    editReturnAmount(id: String!, returnAmount: Int!): Int
    addPaBill(id: String!, billType: String!): ID
    addMcBill(id: String!): ID
    updatePaBill(
      billType: String!
      resId: String!
      billId: String!
      startDate: String!
      endDate: String!
      electricity: Int!
      billPeriod: String!
      misc: Int!
      roomRent: Int!
      security: Int!
      halfYearly: Int!
    ): JSON
    updateMcBill(
      billType: String!
      resId: String!
      billId: String!
      isPaid: Boolean!
      messOne: String!
      messTwo: String!
      canteen: Int!
      amenity: String!
      halfYearly: Int!
      hasMessFine: Boolean!
      hasCanteenFine: Boolean!
      billPeriod: String!
    ): JSON
    updateSaDetail(
      detId: ID!
      receiptDate: String!
      depositDate: String!
      receiptNumber: Int!
      studentName: String!
      roomNumber: String!
      rollNumber: String!
      hostelSecurity: Int!
      messSecurity: Int!
      canteenSecurity: Int!
    ): JSON
    updatePaBillType(id: String!, billType: String!, billId: String!): JSON
    updateMcBillType(id: String!, billType: String!, billId: String!): JSON
    updateSaDayTotal(detId: ID!, deposit: Int!): String
    removePaBill(resId: String!, billId: String!): String
    removeMcBill(resId: String!, billId: String!): String
    removeSaDayTotal(depositDate: String!): String
    autoDepositSaDayTotal(id: ID!): String
  }
`;

const mcDaySchema = makeExecutableSchema({
  typeDefs: [mcDayQuery, mcDayMutation, jsonType]
});

const mcMonthSchema = makeExecutableSchema({
  typeDefs: [mcMonthQuery, mcMonthMutation, jsonType]
});

const resDetailSchema = makeExecutableSchema({
  typeDefs: [resDetailQuery, jsonType]
});

const querySchema = makeExecutableSchema({
  typeDefs: [queryType, jsonType]
});

const mutationSchema = makeExecutableSchema({
  typeDefs: [mutationType, jsonType]
});

const schemas = [
  mcDaySchema,
  mcMonthSchema,
  resDetailSchema,
  querySchema,
  mutationSchema
];

export default schemas;
