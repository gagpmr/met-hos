import connectMongo from "/imports/server/connector";

const getDefault = async () => {
  const mongo = await connectMongo();
  const item = {
    _id: await new mongo.ObjectID().toString()
  };
  item.DetailId = "";
  item.ResidentId = "";
  item.BillPeriod = "";
  item.MessOne = 0;
  item.MessTwo = 0;
  item.Canteen = 0;
  item.MessFine = 0;
  item.CanteenFine = 0;
  item.Amenity = 0;
  item.HalfYearly = 0;
  item.HalfYearlyFine = 0;
  item.Total = 0;
  item.Type = "";
  await mongo.client.close();
  return item;
};

const getCollection = async () => {
  const mongo = await connectMongo();
  let col = await mongo.client.collection("McDetailBills");
  try {
    await col.stats();
    return {
      mongo,
      collection: col
    };
  } catch (error) {
    col = await mongo.client.createCollection("McDetailBills");
    return {
      mongo,
      collection: col
    };
  }
};

const insert = async item => {
  const { mongo, collection } = await getCollection();
  await collection.insert(item);
  await mongo.client.close();
};

const dbMcDetailBills = {
  insert,
  getDefault
};

export default dbMcDetailBills;
