import { _ } from "underscore";
import connectMongo from "../../server/connector";
import dbSaDetails from "../db/dbSaDetails";
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

const getAll = async () => {
  const mongo = await connectMongo();
  const array = await mongo.SaDayTotals.find().toArray();
  await mongo.client.close();
  return array;
};

const getByPage = async skip => {
  const mongo = await connectMongo();
  const out = await mongo.SaDayTotals.find()
    .sort({ DepositDate: -1 })
    .limit(15)
    .skip(skip)
    .toArray();
  await mongo.client.close();
  return out;
};

const remove = async id => {
  const mongo = await connectMongo();
  await mongo.SaDayTotals.remove({
    _id: id
  });
  await mongo.client.close();
};

const getUseless = async () => {
  const mongo = await connectMongo();
  const all = await dbSaDetails.getAll();
  const array = [];
  for (const element of all) {
    const count = await mongo.SaDetails.find({
      DepositDate: element.DepositDate
    }).count();
    if (count === 0) {
      array.push(element);
    }
  }
  await mongo.client.close();
  return array;
};

const updateForDepositDate = async (depositDate, daytotal) => {
  const mongo = await connectMongo();
  const count = await mongo.SaDayTotals.find({
    DepositDate: depositDate
  }).count();
  if (count < 1) {
    const ndaytotal = Object.assign({}, daytotal);
    ndaytotal._id = await new mongo.ObjectID().toString();
    await mongo.SaDayTotals.insert(ndaytotal);
  }
  if (count === 1) {
    const existing = await mongo.SaDayTotals.findOne({
      DepositDate: daytotal.DepositDate
    });
    const ndaytotal = Object.assign({}, daytotal);
    ndaytotal.Deposit = existing.Deposit;
    ndaytotal.ExcessDeposit = existing.Deposit - ndaytotal.Total;
    await mongo.SaDayTotals.update({ _id: existing._id }, ndaytotal);
  }
  await mongo.client.close();
};

const saDayTotalsCount = async () => {
  const sadets = await dbSaDetails.getAll();
  const out = _.uniq(sadets, false, sadet =>
    moment.utc(sadet.DepositDate).format("DD-MMMM-YYYY")
  );
  return out.length;
};

const removeByDate = async depositDate => {
  const mongo = await connectMongo();
  await mongo.SaDayTotals.remove({ DepositDate: depositDate });
  await mongo.client.close();
};

const autoDeposit = async id => {
  const mongo = await connectMongo();
  const dayTotal = await mongo.SaDayTotals.findOne({ _id: id });
  await mongo.SaDayTotals.update(
    { _id: id },
    {
      $set: {
        Deposit: dayTotal.Total,
        ExcessDeposit: 0
      }
    }
  );
  await mongo.client.close();
};

const getById = async detId => {
  const mongo = await connectMongo();
  const dayTotal = await mongo.SaDayTotals.findOne({ _id: detId });
  await mongo.client.close();
  return { detail: dayTotal };
};

const updateSaDayDeposits = async (detId, deposit) => {
  const mongo = await connectMongo();
  const det = await mongo.SaDayTotals.findOne({ _id: detId });
  const excess = parseInt(deposit, 10) - det.Total;
  const nDeposit = parseInt(deposit, 10);
  await mongo.SaDayTotals.update(
    { _id: detId },
    {
      $set: {
        ExcessDeposit: excess,
        Deposit: nDeposit
      }
    }
  );
  await mongo.client.close();
};

const getByDepositMonth = async depositMonth => {
  const mongo = await connectMongo();
  const dets = await mongo.SaDayTotals.find({ DepositMonth: depositMonth })
    .sort({ DepositDate: 1 })
    .toArray();
  await mongo.client.close();
  return dets;
};

const getByDepositDate = async depositDate => {
  const mongo = await connectMongo();
  const det = await mongo.SaDayTotals.findOne({ DepositDate: depositDate });
  await mongo.client.close();
  return det;
};

const update = async dayTotal => {
  const mongo = await connectMongo();
  await mongo.SaDayTotals.update({ _id: dayTotal._id }, dayTotal);
  await mongo.client.close();
};

const insert = async doc => {
  const mongo = await connectMongo();
  await mongo.SaDayTotals.insert(doc);
  await mongo.client.close();
};

const autoDepositMonth = async month => {
  const mongo = await connectMongo();
  const docs = await mongo.SaDayTotals.find({ DepositMonth: month }).toArray();
  let total = 0;
  for (let i = 0; i < docs.length; i++) {
    const element = docs[i];
    total = element.Total;
    await mongo.SaDayTotals.update(
      { _id: element._id },
      {
        $set: {
          Deposit: total,
          ExcessDeposit: 0
        }
      }
    );
  }
  await mongo.client.close();
};

const removeByMonth = async month => {
  const mongo = await connectMongo();
  await mongo.SaDayTotals.remove({ DepositMonth: month });
  await mongo.client.close();
};

const dbSaDayTotals = {
  removeByMonth,
  autoDepositMonth,
  insert,
  update,
  getByDepositDate,
  getByDepositMonth,
  updateSaDayDeposits,
  getById,
  autoDeposit,
  getAll,
  getByPage,
  getUseless,
  remove,
  removeByDate,
  updateForDepositDate,
  saDayTotalsCount,
  getDefault
};

export default dbSaDayTotals;
