import { _ } from "underscore";
import connectMongo from "../../server/connector";
import moment from "moment";

const getDefault = async () => {
  const mongo = await connectMongo();
  const item = {
    _id: await new mongo.ObjectID().toString()
  };
  item.ReceiptDate = moment.utc("01-01-1001", "DD-MM-YYYY").toDate();
  item.DepositDate = moment.utc("01-01-1001", "DD-MM-YYYY").toDate();
  item.ResidentId = "";
  item.ReceiptNumber = "";
  item.Name = "";
  item.RoomNumber = "";
  item.RollNumber = "";
  item.RoomRent = 0;
  item.WaterCharges = 0;
  item.ElectricityCharges = 0;
  item.Miscellaneous = 0;
  item.DevelopmentFund = 0;
  item.RutineHstlMaintnceCharges = 0;
  item.Total = 0;
  item.Focus = false;
  await mongo.client.close();
  return item;
};

const getAll = async () => {
  const mongo = await connectMongo();
  const out = await mongo.PaDetails.find().toArray();
  await mongo.client.close();
  return out;
};

const focusFalseForDate = async date => {
  const mongo = await connectMongo();
  await mongo.PaDetails.update(
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
  await mongo.PaDetails.insert(det);
  await mongo.client.close();
};

const getForDepositDate = async depositDate => {
  const mongo = await connectMongo();
  const out = await mongo.PaDetails.find({ DepositDate: depositDate })
    .sort({ RollNumber: 1 })
    .toArray();
  await mongo.client.close();
  return out;
};

const getById = async detId => {
  const mongo = await connectMongo();
  const detail = await mongo.PaDetails.findOne({ _id: detId });
  await mongo.client.close();
  return detail;
};

const removeById = async detId => {
  const mongo = await connectMongo();
  await mongo.PaDetails.remove({ _id: detId });
  await mongo.client.close();
};

const insertCancelled = async (rNum, rDate) => {
  const mongo = await connectMongo();
  const det = await getDefault();
  det.ReceiptDate = rDate;
  det.DepositDate = rDate;
  det.ReceiptNumber = rNum;
  det.Name = "Cancelled";
  det.RoomNumber = "--";
  det.RollNumber = "--";
  det.Focus = true;
  await mongo.PaDetails.insert(det);
  await mongo.client.close();
};

const updateDetail = async detail => {
  const mongo = await connectMongo();
  await focusFalseForDate(detail.DepositDate);
  await mongo.PaDetails.update({ _id: detail._id }, detail);
  await mongo.client.close();
};

const removeByDate = async depositDate => {
  const mongo = await connectMongo();
  await mongo.PaDetails.remove({ DepositDate: depositDate });
  await mongo.client.close();
};

const getByResId = async resId => {
  const mongo = await connectMongo();
  const docs = await mongo.PaDetails.find({ ResidentId: resId })
    .sort({
      DepositDate: 1
    })
    .toArray();
  await mongo.client.close();
  return docs;
};

const lastDetail = async () => {
  const mongo = await connectMongo();
  const lastDepoDateDetails = await mongo.PaDetails.find()
    .sort({
      DepositDate: -1,
      ReceiptNumber: -1
    })
    .toArray();
  const first = _.first(lastDepoDateDetails);
  await mongo.client.close();
  return first;
};

const residentAdmissionDetails = async resId => {
  const mongo = await connectMongo();
  const docs = await mongo.PaDetails.find({
    ResidentId: resId,
    DevelopmentFund: { $ne: 0 }
  })
    .sort({
      DepositDate: -1,
      ReceiptNumber: -1
    })
    .toArray();
  const ndocs = await mongo.PaDetails.find({
    ResidentId: resId,
    Security: { $gt: 0 }
  })
    .sort({
      DepositDate: -1,
      ReceiptNumber: -1
    })
    .toArray();
  for (let i = 0; i < ndocs.length; i++) {
    const element = ndocs[i];
    docs.push(element);
  }
  await mongo.client.close();
  return docs;
};

const dbPaDetails = {
  residentAdmissionDetails,
  lastDetail,
  getByResId,
  removeByDate,
  updateDetail,
  insertCancelled,
  focusFalseForDate,
  removeById,
  getById,
  getForDepositDate,
  insert,
  getDefault,
  getAll
};

export default dbPaDetails;
