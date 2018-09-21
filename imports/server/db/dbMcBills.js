import { _ } from "underscore";
import connectMongo from "/imports/server/connector";

const getDefault = async () => {
  const mongo = await connectMongo();
  const item = {
    _id: await new mongo.ObjectID().toString()
  };
  item.MessOne = 0;
  item.MessTwo = 0;
  item.Canteen = 0;
  item.MessFine = 0;
  item.CanteenFine = 0;
  item.Amenity = 0;
  item.Total = 0;
  item.HalfYearly = 0;
  item.HalfYearlyFine = 0;
  item.BillPeriod = "";
  item.Type = "";
  item.SrNo = 1;
  item.HasMessFine = true;
  item.HasCanteenFine = true;
  await mongo.client.close();
  return item;
};

const getBillForResident = async (resId, billId) => {
  const mongo = await connectMongo();
  const resi = await mongo.Residents.findOne({ _id: resId });
  let bill = {};
  if (resi !== null) {
    resi.McBills.forEach(myDoc => {
      if (myDoc._id === billId) {
        bill = Object.assign({}, myDoc);
      }
    });
  }
  await mongo.client.close();
  return bill;
};

const getAll = async resId => {
  const mongo = await connectMongo();
  const resi = await mongo.Residents.findOne({ _id: resId });
  await mongo.client.close();
  return resi.McBills;
};

const nextSrNo = async resId => {
  const mongo = await connectMongo();
  const bills = await getAll(resId);
  const nBills = [];
  for (let i = 0; i < bills.length; i++) {
    const element = bills[i];
    const newSrNo = i + 1;
    if (element.SrNo !== newSrNo) {
      element.SrNo = newSrNo;
      nBills.push(element);
    }
  }
  for (const element of nBills) {
    await mongo.Residents.update(
      {
        _id: resId
      },
      {
        $pull: {
          McBills: {
            _id: element._id
          }
        }
      }
    );
    await mongo.Residents.update(
      {
        _id: resId
      },
      {
        $addToSet: {
          McBills: element
        }
      }
    );
  }
  const nbills = await getAll(resId);
  const top = _.max(nbills, bill => bill.SrNo);
  if (top.SrNo === undefined) {
    return 1;
  }
  await mongo.client.close();
  return top.SrNo + 1;
};

const removeMcBill = async (resId, mcBill) => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    {
      _id: resId
    },
    {
      $pull: {
        McBills: {
          _id: mcBill._id
        }
      }
    }
  );
  await mongo.client.close();
  await nextSrNo(resId);
  return mcBill;
};

const insertMcBill = async (resId, mcBill) => {
  const mongo = await connectMongo();
  let billId = "";
  const nBill = Object.assign({}, mcBill);
  if (nBill._id === undefined) {
    billId = await new mongo.ObjectID().toString();
    nBill._id = billId;
  }
  await mongo.Residents.update(
    {
      _id: resId
    },
    {
      $addToSet: {
        McBills: nBill
      }
    }
  );
  await mongo.client.close();
  return billId;
};

const replaceMcBill = async (resId, mcBill) => {
  await removeMcBill(resId, mcBill);
  await insertMcBill(resId, mcBill);
  return mcBill;
};

const dbMcBills = {
  getDefault,
  nextSrNo,
  getAll,
  replaceMcBill,
  removeMcBill,
  insertMcBill,
  getBillForResident
};

export default dbMcBills;
