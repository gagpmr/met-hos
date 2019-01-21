import { _ } from "underscore";
import connectMongo from "../../server/connector";
import dbPaBills from "./dbPaBills";

const getAll = async resId => {
  const mongo = await connectMongo();
  const res = await mongo.Residents.findOne({
    _id: resId
  });
  await mongo.client.close();
  return res.TxnPaBills;
};

const insertBill = async (resId, billId) => {
  const mongo = await connectMongo();
  const bill = await dbPaBills.getBillForResident(resId, billId);
  const bills = await getAll(resId);
  const selected = _.first(_.filter(bills, item => item._id === bill._id));
  if (selected === undefined) {
    await mongo.Residents.update(
      {
        _id: resId
      },
      {
        $addToSet: {
          TxnPaBills: bill
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
        TxnPaBills: {
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
        TxnPaBills: []
      }
    }
  );
  await mongo.client.close();
};

const addAll = async resId => {
  const bills = await dbPaBills.getAll(resId);
  for (const bill of bills) {
    await insertBill(resId, bill._id);
  }
};

const dbTxnPaBills = {
  addAll,
  removeAll,
  removeBill,
  getAll,
  insertBill
};

export default dbTxnPaBills;
