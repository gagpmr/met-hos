import connectMongo from "../../server/connector";
import moment from "moment";

const getCollection = async () => {
  const mongo = await connectMongo();
  let col = await mongo.client.collection("PaDetailBills");
  try {
    await col.stats();
    return {
      mongo,
      collection: col
    };
  } catch (error) {
    col = mongo.client.createCollection("PaDetailBills");
    return {
      mongo,
      collection: col
    };
  }
};

const getDefault = async () => {
  const mongo = await connectMongo();
  const item = {
    _id: await new mongo.ObjectID().toString()
  };
  item.DetailId = "";
  item.ResidentId = "";
  item.BillPeriod = "";
  item.RoomRent = 0;
  item.WaterCharges = 0;
  item.ElectricityCharges = 0;
  item.HalfYearly = 0;
  item.Miscellaneous = 0;
  item.Security = 0;
  item.StartDate = moment.utc("01-01-1001", "DD-MM-YYYY").toDate();
  item.EndDate = moment.utc("01-01-1001", "DD-MM-YYYY").toDate();
  item.Total = 0;
  item.Type = "";
  await mongo.client.close();
  return item;
};

const insert = async item => {
  const { mongo, collection } = await getCollection();
  await collection.insert(item);
  await mongo.client.close();
};

const dbPaDetailBills = {
  insert,
  getDefault
};

export default dbPaDetailBills;
