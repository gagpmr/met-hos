import { _ } from "underscore";
import connectMongo from "/imports/server/connector";
import dbSaDayTotals from "/imports/server/db/dbSaDayTotals";
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
    Deposit: 0,
    ExcessDeposit: 0,
    HostelSecurity: 0,
    MessSecurity: 0,
    CanteenSecurity: 0,
    Total: 0
  };
  await mongo.client.close();
  return detail;
};

// const getAll = async () => {
//   const mongo = await connectMongo();
//   const array = await mongo.SaDetails.find().toArray();
//   await mongo.client.close();
//   return array;
// };

const getByPage = async skip => {
  const mongo = await connectMongo();
  const out = await mongo.SaMonthTotals.find()
    .sort({ DepositDate: -1 })
    .limit(15)
    .skip(skip)
    .toArray();
  await mongo.client.close();
  return out;
};

const remove = async id => {
  const mongo = await connectMongo();
  await mongo.SaMonthTotals.remove({
    _id: id
  });
  await mongo.client.close();
};

const saMonthTotalsCount = async () => {
  const sadets = await dbSaDayTotals.getAll();
  const out = _.uniq(sadets, false, sadet =>
    moment.utc(sadet.DepositDate).format("MMMM, YYYY")
  );
  return out.length;
};

// const removeByDate = async depositDate => {
//   const mongo = await connectMongo();
//   await mongo.SaDayTotals.remove({ DepositDate: depositDate });
//   await mongo.client.close();
// };

const getById = async monthId => {
  const mongo = await connectMongo();
  const monthTotal = await mongo.SaMonthTotals.findOne({ _id: monthId });
  await mongo.client.close();
  return monthTotal;
};

const getByDepositMonth = async depositMonth => {
  const mongo = await connectMongo();
  const doc = await mongo.SaMonthTotals.findOne({ DepositMonth: depositMonth });
  await mongo.client.close();
  return doc;
};

const update = async doc => {
  const mongo = await connectMongo();
  await mongo.SaMonthTotals.update({ _id: doc._id }, doc);
  await mongo.client.close();
};

const insert = async doc => {
  const mongo = await connectMongo();
  await mongo.SaMonthTotals.insert(doc);
  await mongo.client.close();
};

const autoDeposit = async month => {
  const mongo = await connectMongo();
  const doc = await mongo.SaMonthTotals.findOne({ DepositMonth: month });
  await mongo.SaMonthTotals.update(
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
  await mongo.SaMonthTotals.remove({ DepositMonth: month });
  await mongo.client.close();
};

const updateMonthDeposit = async (month, deposit, excessDeposit) => {
  const mongo = await connectMongo();
  await mongo.SaMonthTotals.update(
    { DepositMonth: month },
    {
      $set: { Deposit: deposit, ExcessDeposit: excessDeposit }
    }
  );
  await mongo.client.close();
};

const dbSaMonthTotals = {
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

export default dbSaMonthTotals;
