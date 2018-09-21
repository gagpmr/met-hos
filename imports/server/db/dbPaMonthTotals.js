import { _ } from "underscore";
import connectMongo from "/imports/server/connector";
import dbPaDayTotals from "/imports/server/db/dbPaDayTotals";
import moment from "moment";

const getDefault = async () => {
  const mongo = await connectMongo();
  const date = moment
    .utc()
    .startOf("day")
    .toDate();
  const detail = {
    _id: await new mongo.ObjectID().toString(),
    DepositDate: date,
    DepositMonth: moment.utc().format("MMM, YYYY"),
    RoomRent: 0,
    WaterCharges: 0,
    ElectricityCharges: 0,
    DevelopmentFund: 0,
    RutineHstlMaintnceCharges: 0,
    Miscellaneous: 0,
    Total: 0,
    Deposit: 0,
    ExcessDeposit: 0
  };
  await mongo.client.close();
  return detail;
};

const getByPage = async skip => {
  const mongo = await connectMongo();
  const out = await mongo.PaMonthTotals.find()
    .sort({ DepositDate: -1 })
    .limit(15)
    .skip(skip)
    .toArray();
  await mongo.client.close();
  return out;
};

const remove = async id => {
  const mongo = await connectMongo();
  await mongo.PaMonthTotals.remove({
    _id: id
  });
  await mongo.client.close();
};

const saMonthTotalsCount = async () => {
  const docs = await dbPaDayTotals.getAll();
  const out = _.uniq(docs, false, doc =>
    moment.utc(doc.DepositDate).format("MMMM, YYYY")
  );
  return out.length;
};

const getById = async monthId => {
  const mongo = await connectMongo();
  const monthTotal = await mongo.PaMonthTotals.findOne({ _id: monthId });
  await mongo.client.close();
  return monthTotal;
};

const getByDepositMonth = async depositMonth => {
  const mongo = await connectMongo();
  const doc = await mongo.PaMonthTotals.findOne({ DepositMonth: depositMonth });
  await mongo.client.close();
  return doc;
};

const update = async doc => {
  const mongo = await connectMongo();
  await mongo.PaMonthTotals.update({ _id: doc._id }, doc);
  await mongo.client.close();
};

const insert = async doc => {
  const mongo = await connectMongo();
  await mongo.PaMonthTotals.insert(doc);
  await mongo.client.close();
};

const autoDeposit = async month => {
  const mongo = await connectMongo();
  const doc = await mongo.PaMonthTotals.findOne({ DepositMonth: month });
  await mongo.PaMonthTotals.update(
    { _id: doc._id },
    {
      $set: {
        Deposit: doc.Total,
        ExcessDeposit: 0
      }
    }
  );
  await mongo.client.close();
};

const removeByMonth = async month => {
  const mongo = await connectMongo();
  await mongo.PaMonthTotals.remove({ DepositMonth: month });
  await mongo.client.close();
};

const updateMonthDeposit = async (month, deposit, excessDeposit) => {
  const mongo = await connectMongo();
  await mongo.PaMonthTotals.update(
    { DepositMonth: month },
    {
      $set: { Deposit: deposit, ExcessDeposit: excessDeposit }
    }
  );
  await mongo.client.close();
};

const dbPaMonthTotals = {
  updateMonthDeposit,
  removeByMonth,
  autoDeposit,
  insert,
  getDefault,
  remove,
  update,
  getByDepositMonth,
  getById,
  getByPage,
  saMonthTotalsCount
};

export default dbPaMonthTotals;
