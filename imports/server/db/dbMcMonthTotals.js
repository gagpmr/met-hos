import { _ } from "underscore";
import connectMongo from "/imports/server/connector";
import dbMcDayTotals from "/imports/server/db/dbMcDayTotals";
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
    MessOne: 0,
    MessTwo: 0,
    Canteen: 0,
    Fines: 0,
    Amenity: 0,
    PoorStuWelFund: 0,
    McServantWelFund: 0,
    FoodSubsidy: 0,
    CelebrationFund: 0,
    Total: 0,
    Deposit: 0,
    ExcessDeposit: 0
  };
  await mongo.client.close();
  return detail;
};

const getByPage = async skip => {
  const mongo = await connectMongo();
  const out = await mongo.McMonthTotals.find()
    .sort({ DepositDate: -1 })
    .limit(15)
    .skip(skip)
    .toArray();
  await mongo.client.close();
  return out;
};

const remove = async id => {
  const mongo = await connectMongo();
  await mongo.McMonthTotals.remove({
    _id: id
  });
  await mongo.client.close();
};

const monthTotalsCount = async () => {
  const docs = await dbMcDayTotals.getAll();
  const out = _.uniq(docs, false, doc =>
    moment.utc(doc.DepositDate).format("MMMM, YYYY")
  );
  return out.length;
};

const getById = async monthId => {
  const mongo = await connectMongo();
  const monthTotal = await mongo.McMonthTotals.findOne({ _id: monthId });
  await mongo.client.close();
  return monthTotal;
};

const getByDepositMonth = async depositMonth => {
  const mongo = await connectMongo();
  const doc = await mongo.McMonthTotals.findOne({ DepositMonth: depositMonth });
  await mongo.client.close();
  return doc;
};

const update = async doc => {
  const mongo = await connectMongo();
  await mongo.McMonthTotals.update({ _id: doc._id }, doc);
  await mongo.client.close();
};

const insert = async doc => {
  const mongo = await connectMongo();
  await mongo.McMonthTotals.insert(doc);
  await mongo.client.close();
};

const autoDeposit = async month => {
  const mongo = await connectMongo();
  const doc = await mongo.McMonthTotals.findOne({ DepositMonth: month });
  await mongo.McMonthTotals.update(
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
  await mongo.McMonthTotals.remove({ DepositMonth: month });
  await mongo.client.close();
};

const updateMonthDeposit = async (month, deposit, excessDeposit) => {
  const mongo = await connectMongo();
  await mongo.McMonthTotals.update(
    { DepositMonth: month },
    {
      $set: { Deposit: deposit, ExcessDeposit: excessDeposit }
    }
  );
  await mongo.client.close();
};

const dbMcMonthTotals = {
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
  monthTotalsCount
};

export default dbMcMonthTotals;
