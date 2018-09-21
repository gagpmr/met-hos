import { _ } from "underscore";
import connectMongo from "/imports/server/connector";
import moment from "moment";

const getDefault = async () => {
  const mongo = await connectMongo();
  const item = {
    _id: await new mongo.ObjectID().toString()
  };
  item.ReceiptDate = moment.utc("01-01-1001", "DD-MM-YYYY").toDate();
  item.DepositDate = moment.utc("01-01-1001", "DD-MM-YYYY").toDate();
  item.ResidentId = "";
  item.MonthName = "";
  item.ReceiptNumber = 0;
  item.StudentName = "";
  item.RoomNumber = "";
  item.RollNumber = "";
  item.MessOne = 0;
  item.MessTwo = 0;
  item.Canteen = 0;
  item.Fines = 0;
  item.Amenity = 0;
  item.PoorStuWelFund = 0;
  item.McServantWelFund = 0;
  item.FoodSubsidy = 0;
  item.CelebrationFund = 0;
  item.Total = 0;
  item.Focus = false;
  await mongo.client.close();
  return item;
};

const updateMcDetail = async detail => {
  const mongo = await connectMongo();
  await mongo.McDetails.update({ _id: detail._id }, detail);
  await mongo.client.close();
};

const getById = async detId => {
  const mongo = await connectMongo();
  const detail = await mongo.McDetails.findOne({ _id: detId });
  await mongo.client.close();
  return detail;
};

const lastDetail = async depositDate => {
  const mongo = await connectMongo();
  let lastDepoDateDetails = await mongo.McDetails.find({
    DepositDate: depositDate
  })
    .sort({
      DepositDate: -1,
      ReceiptNumber: -1
    })
    .toArray();
  if (lastDepoDateDetails.length === 0) {
    lastDepoDateDetails = await mongo.McDetails.find()
      .sort({
        DepositDate: -1,
        ReceiptNumber: -1
      })
      .toArray();
  }
  const first = _.first(lastDepoDateDetails);
  await mongo.client.close();
  return first;
};

const getAll = async () => {
  const mongo = await connectMongo();
  const mcdets = await mongo.McDetails.find().toArray();
  await mongo.client.close();
  return mcdets;
};

const focusFalseForDate = async date => {
  const mongo = await connectMongo();
  await mongo.McDetails.update(
    { DepositDate: date },
    {
      $set: {
        Focus: false
      }
    },
    { multi: true }
  );
  await mongo.client.close();
};

const insert = async det => {
  const mongo = await connectMongo();
  if (det.Focus) {
    await focusFalseForDate(det.DepositDate);
  }
  await mongo.McDetails.insert(det);
  await mongo.client.close();
};

const getForDepositDate = async depositDate => {
  const mongo = await connectMongo();
  const out = await mongo.McDetails.find({ DepositDate: depositDate })
    .sort({ ReceiptNumber: 1 })
    .toArray();
  await mongo.client.close();
  return out;
};

const insertCancelled = async (rNum, rDate) => {
  const mongo = await connectMongo();
  const det = await getDefault();
  det.ReceiptDate = rDate;
  det.DepositDate = rDate;
  det.ReceiptNumber = rNum;
  det.StudentName = "Cancelled";
  det.RoomNumber = "--";
  det.RollNumber = "--";
  det.Focus = true;
  await mongo.McDetails.insert(det);
  await mongo.client.close();
};

const removeById = async detId => {
  const mongo = await connectMongo();
  await mongo.McDetails.remove({ _id: detId });
  await mongo.client.close();
};

const updateDetail = async detail => {
  const mongo = await connectMongo();
  await mongo.McDetails.update({ _id: detail._id }, detail);
  await mongo.client.close();
};

const removeByDate = async depositDate => {
  const mongo = await connectMongo();
  await mongo.McDetails.remove({ DepositDate: depositDate });
  await mongo.client.close();
};

const getByResId = async resId => {
  const mongo = await connectMongo();
  const docs = await mongo.McDetails.find({ ResidentId: resId })
    .sort({ DepositDate: 1 })
    .toArray();
  await mongo.client.close();
  return docs;
};

const residentAdmissionDetails = async resId => {
  const mongo = await connectMongo();
  const docs = await mongo.McDetails.find({
    ResidentId: resId,
    PoorStuWelFund: { $ne: 0 }
  })
    .sort({
      DepositDate: -1,
      ReceiptNumber: -1
    })
    .toArray();
  await mongo.client.close();
  return docs;
};

const dbMcDetails = {
  residentAdmissionDetails,
  getByResId,
  removeByDate,
  updateDetail,
  removeById,
  insertCancelled,
  focusFalseForDate,
  getForDepositDate,
  updateMcDetail,
  getById,
  lastDetail,
  insert,
  getDefault,
  getAll
};

export default dbMcDetails;
