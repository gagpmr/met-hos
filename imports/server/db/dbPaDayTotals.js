import { _ } from "underscore";
import connectMongo from "../../server/connector";
import dbPaDetails from "../db/dbPaDetails";
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

const getAll = async () => {
  const mongo = await connectMongo();
  const array = await mongo.PaDayTotals.find().toArray();
  await mongo.client.close();
  return array;
};

const getByPage = async skip => {
  const mongo = await connectMongo();
  const out = await mongo.PaDayTotals.find()
    .sort({ DepositDate: -1 })
    .limit(15)
    .skip(skip)
    .toArray();
  await mongo.client.close();
  return out;
};

const remove = async id => {
  const mongo = await connectMongo();
  await mongo.PaDayTotals.remove({
    _id: id
  });
  await mongo.client.close();
};

const getUseless = async () => {
  const mongo = await connectMongo();
  const all = await dbPaDetails.getAll();
  const array = [];
  for (const element of all) {
    const count = await mongo.PaDetails.find({
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
  const count = await mongo.PaDayTotals.find({
    DepositDate: depositDate
  }).count();
  if (count < 1) {
    const ndaytotal = Object.assign({}, daytotal);
    ndaytotal._id = await new mongo.ObjectID().toString();
    await mongo.PaDayTotals.insert(ndaytotal);
  }
  if (count === 1) {
    const existing = await mongo.PaDayTotals.findOne({
      DepositDate: daytotal.DepositDate
    });
    const ndaytotal = Object.assign({}, daytotal);
    ndaytotal.Deposit = existing.Deposit;
    ndaytotal.ExcessDeposit = existing.Deposit - ndaytotal.Total;
    await mongo.PaDayTotals.update({ _id: existing._id }, ndaytotal);
  }
  await mongo.client.close();
};

const paDayTotalsCount = async () => {
  const sadets = await dbPaDetails.getAll();
  const out = _.uniq(sadets, false, sadet =>
    moment.utc(sadet.DepositDate).format("DD-MMMM-YYYY")
  );
  return out.length;
};

const removeByDate = async depositDate => {
  const mongo = await connectMongo();
  await mongo.PaDayTotals.remove({ DepositDate: depositDate });
  await mongo.client.close();
};

const autoDeposit = async id => {
  const mongo = await connectMongo();
  const dayTotal = await mongo.PaDayTotals.findOne({ _id: id });
  await mongo.PaDayTotals.update(
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
  const dayTotal = await mongo.PaDayTotals.findOne({ _id: detId });
  await mongo.client.close();
  return { detail: dayTotal };
};

const updatePaDayDeposits = async (detId, deposit) => {
  const mongo = await connectMongo();
  const det = await mongo.PaDayTotals.findOne({ _id: detId });
  const excess = parseInt(deposit, 10) - det.Total;
  const nDeposit = parseInt(deposit, 10);
  await mongo.PaDayTotals.update(
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
  const dets = await mongo.PaDayTotals.find({ DepositMonth: depositMonth })
    .sort({ DepositDate: 1 })
    .toArray();
  await mongo.client.close();
  return dets;
};

const getByDepositDate = async depositDate => {
  const mongo = await connectMongo();
  const det = await mongo.PaDayTotals.findOne({ DepositDate: depositDate });
  await mongo.client.close();
  return det;
};

const update = async dayTotal => {
  const mongo = await connectMongo();
  await mongo.PaDayTotals.update({ _id: dayTotal._id }, dayTotal);
  await mongo.client.close();
};

const insert = async doc => {
  const mongo = await connectMongo();
  await mongo.PaDayTotals.insert(doc);
  await mongo.client.close();
};

const autoDepositMonth = async month => {
  const mongo = await connectMongo();
  const docs = await mongo.PaDayTotals.find({ DepositMonth: month }).toArray();
  let total = 0;
  for (let i = 0; i < docs.length; i++) {
    const element = docs[i];
    total = element.Total;
    await mongo.PaDayTotals.update(
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
  await mongo.PaDayTotals.remove({ DepositMonth: month });
  await mongo.client.close();
};

const dbPaDayTotals = {
  removeByMonth,
  autoDepositMonth,
  insert,
  update,
  getByDepositDate,
  getByDepositMonth,
  updatePaDayDeposits,
  getById,
  autoDeposit,
  getAll,
  getByPage,
  getUseless,
  remove,
  removeByDate,
  updateForDepositDate,
  paDayTotalsCount,
  getDefault
};

export default dbPaDayTotals;
