import connectMongo from "../../server/connector";

const getDefault = async () => {
  const mongo = await connectMongo();
  const item = {
    _id: await new mongo.ObjectID().toString()
  };
  item.Name = "";
  item.FatherName = "";
  item.RollNumber = "";
  item.TelephoneNumber = "";
  item.Room = "";
  item.Class = "";
  return item;
};

const getCollection = async () => {
  const mongo = await connectMongo();
  let col = await mongo.client.collection("RemoResidents");
  try {
    await col.stats();
    return {
      mongo,
      collection: col
    };
  } catch (error) {
    col = await mongo.client.createCollection("RemoResidents");
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

const dbRemoResidents = {
  insert,
  getDefault
};

export default dbRemoResidents;
