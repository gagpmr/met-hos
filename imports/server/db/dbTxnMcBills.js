import { _ } from "underscore";
import connectMongo from "/imports/server/connector";
import dbMcBills from "./dbMcBills";

const getAll = async resId => {
  const mongo = await connectMongo();
  const res = await mongo.Residents.findOne({
    _id: resId
  });
  await mongo.client.close();
  return res.TxnMcBills;
};

const insertBill = async (resId, billId) => {
  const mongo = await connectMongo();
  const bill = await dbMcBills.getBillForResident(resId, billId);
  const bills = await getAll(resId);
  const selected = _.first(_.filter(bills, item => item._id === bill._id));
  if (selected === undefined) {
    await mongo.Residents.update(
      {
        _id: resId
      },
      {
        $addToSet: {
          TxnMcBills: bill
        }
      }
    );
  }
  await mongo.client.close();
};

const removeBill = async (resId, billId) => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    {
      _id: resId
    },
    {
      $pull: {
        TxnMcBills: {
          _id: billId
        }
      }
    }
  );
  await mongo.client.close();
};

const removeAll = async resId => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    {
      _id: resId
    },
    {
      $set: {
        TxnMcBills: []
      }
    }
  );
  await mongo.client.close();
};

const addAll = async resId => {
  const bills = await dbMcBills.getAll(resId);
  for (const bill of bills) {
    await insertBill(resId, bill._id);
  }
};

const dbTxnMcBills = {
  addAll,
  removeAll,
  removeBill,
  getAll,
  insertBill
};

export default dbTxnMcBills;
