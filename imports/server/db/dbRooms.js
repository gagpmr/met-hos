import connectMongo from "/imports/server/connector";

const getByValue = async value => {
  const mongo = await connectMongo();
  const room = await mongo.Rooms.findOne({ Value: value });
  await mongo.client.close();
  return room;
};

const getAll = async () => {
  const mongo = await connectMongo();
  const rooms = await mongo.Rooms.find({})
    .sort({ Value: 1 })
    .toArray();
  await mongo.client.close();
  return rooms;
};

const dbRooms = {
  getByValue,
  getAll
};

export default dbRooms;
