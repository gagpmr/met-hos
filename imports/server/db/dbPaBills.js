import { _ } from "underscore";
import moment from "moment";
import connectMongo from "/imports/server/connector";

const getDefault = async () => {
  const startdate = moment
    .utc()
    .utcOffset(+5.5)
    .toDate();
  const enddate = moment
    .utc()
    .utcOffset(+5.5)
    .toDate();
  const mongo = await connectMongo();
  const item = {
    _id: await new mongo.ObjectID().toString()
  };
  item.BillPeriod = "";
  item.RoomRent = 0;
  item.WaterCharges = 0;
  item.ElectricityCharges = 0;
  item.HalfYearly = 0;
  item.Miscellaneous = 0;
  item.Security = 0;
  item.StartDate = startdate;
  item.EndDate = enddate;
  item.SrNo = 1;
  item.Total = 0;
  item.Type = "";
  await mongo.client.close();
  return item;
};

const getBillForResident = async (resId, billId) => {
  const mongo = await connectMongo();
  const resi = await mongo.Residents.findOne({ _id: resId });
  let bill = {};
  if (resi !== null) {
    resi.PaBills.forEach(myDoc => {
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
  return resi.PaBills;
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
          PaBills: {
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
          PaBills: element
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

const removePaBill = async (resId, paBill) => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    {
      _id: resId
    },
    {
      $pull: {
        PaBills: {
          _id: paBill._id
        }
      }
    }
  );
  await mongo.client.close();
  await nextSrNo(resId);
};

const insertPaBill = async (resId, paBill) => {
  const mongo = await connectMongo();
  let billId = "";
  const nPaBill = Object.assign({}, paBill);
  if (nPaBill._id === undefined) {
    billId = await new mongo.ObjectID().toString();
    nPaBill._id = billId;
  }
  await mongo.Residents.update(
    {
      _id: resId
    },
    {
      $addToSet: {
        PaBills: nPaBill
      }
    }
  );
  await mongo.client.close();
  return nPaBill._id;
};

const replacePaBill = async (resId, paBill) => {
  await removePaBill(resId, paBill);
  await insertPaBill(resId, paBill);
  return paBill;
};

const dbPaBills = {
  getDefault,
  nextSrNo,
  getAll,
  replacePaBill,
  removePaBill,
  insertPaBill,
  getBillForResident
};

export default dbPaBills;
