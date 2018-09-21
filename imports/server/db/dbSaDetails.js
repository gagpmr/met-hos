import { _ } from "underscore";
import connectMongo from "/imports/server/connector";
import moment from "moment";

const defaultSaDetail = async () => {
  const mongo = await connectMongo();
  const date = moment
    .utc()
    .startOf("day")
    .toDate();
  const detail = {
    _id: await new mongo.ObjectID().toString(),
    ReceiptDate: date,
    DepositDate: date,
    ReceiptNumber: 0,
    ResidentId: "",
    StudentName: "",
    RoomNumber: "",
    RollNumber: "",
    HostelSecurity: 0,
    MessSecurity: 0,
    CanteenSecurity: 0,
    Total: 0,
    Focus: false
  };
  await mongo.client.close();
  return detail;
};

const focusFalseForDate = async depositDate => {
  const mongo = await connectMongo();
  await mongo.SaDetails.update(
    { DepositDate: depositDate },
    {
      $set: {
        Focus: false,
        UpdatedAt: new Date()
      }
    }
  );
  await mongo.client.close();
};

const insertDetail = async detail => {
  const mongo = await connectMongo();
  const result = await mongo.SaDetails.insert(detail);
  await mongo.client.close();
  return _.first(result.insertedIds);
};

const lastDetail = async () => {
  const mongo = await connectMongo();
  const lastDepoDateDetails = await mongo.SaDetails.find()
    .sort({
      DepositDate: -1,
      ReceiptNumber: -1
    })
    .toArray();
  const first = _.first(lastDepoDateDetails);
  await mongo.client.close();
  return first;
};

const getById = async detId => {
  const mongo = await connectMongo();
  const detail = await mongo.SaDetails.findOne({ _id: detId });
  await mongo.client.close();
  return detail;
};

const updateSaDetail = async detail => {
  const mongo = await connectMongo();
  await mongo.SaDetails.update({ _id: detail._id }, detail);
  await mongo.client.close();
};

const getAll = async () => {
  const mongo = await connectMongo();
  const array = await mongo.SaDetails.find().toArray();
  await mongo.client.close();
  return array;
};

const getAllByDepositDate = async () => {
  const mongo = await connectMongo();
  const out = await mongo.SaDetails.find()
    .sort({ DepositDate: -1 })
    .toArray();
  await mongo.client.close();
  return out;
};

const getForDepositDate = async depositDate => {
  const mongo = await connectMongo();
  const out = await mongo.SaDetails.find({ DepositDate: depositDate })
    .sort({ ReceiptNumber: 1 })
    .toArray();
  await mongo.client.close();
  return out;
};

const removeByDate = async depositDate => {
  const mongo = await connectMongo();
  await mongo.SaDetails.remove({ DepositDate: depositDate });
  await mongo.client.close();
};

const removeById = async detId => {
  const mongo = await connectMongo();
  await mongo.SaDetails.remove({ _id: detId });
  await mongo.client.close();
};

const insertCancelled = async (rNum, rDate) => {
  const mongo = await connectMongo();
  const det = await defaultSaDetail();
  det.ReceiptDate = rDate;
  det.DepositDate = rDate;
  det.ReceiptNumber = rNum;
  det.StudentName = "Cancelled";
  det.RoomNumber = "--";
  det.RollNumber = "--";
  det.Focus = true;
  await mongo.SaDetails.insert(det);
  await mongo.client.close();
};

const getByResId = async resId => {
  const mongo = await connectMongo();
  const docs = await mongo.SaDetails.find({ ResidentId: resId }).toArray();
  await mongo.client.close();
  return docs;
};

const residentAdmissionDetails = async resId => {
  const mongo = await connectMongo();
  const docs = await mongo.SaDetails.find({
    ResidentId: resId
  })
    .sort({
      DepositDate: -1,
      ReceiptNumber: -1
    })
    .toArray();
  await mongo.client.close();
  return docs;
};

const dbSaDetails = {
  residentAdmissionDetails,
  getByResId,
  insertCancelled,
  removeById,
  focusFalseForDate,
  defaultSaDetail,
  lastDetail,
  getById,
  insertDetail,
  updateSaDetail,
  getAll,
  getAllByDepositDate,
  getForDepositDate,
  removeByDate
};

export default dbSaDetails;
