import connectMongo from "/imports/server/connector";

const getAll = async () => {
  const mongo = await connectMongo();
  const months = await mongo.MonthsMc.find().toArray();
  await mongo.client.close();
  return months;
};

const insert = async month => {
  const mongo = await connectMongo();
  await mongo.MonthsMc.insert(month);
  await mongo.client.close();
};

const removeAll = async () => {
  const mongo = await connectMongo();
  await mongo.MonthsMc.remove({});
  await mongo.client.close();
};

const getByMonth = async month => {
  const mongo = await connectMongo();
  const monthOut = await mongo.MonthsMc.findOne({ Value: month });
  await mongo.client.close();
  return monthOut;
};

const getSelectedTrue = async () => {
  const mongo = await connectMongo();
  const mcMonth = await mongo.MonthsMc.findOne({ Selected: true });
  await mongo.client.close();
  return mcMonth;
};

const countAll = async () => {
  const mongo = await connectMongo();
  const count = await mongo.MonthsMc.find().count();
  await mongo.client.close();
  return count;
};

const dbMonthsMc = {
  getAll,
  insert,
  removeAll,
  getByMonth,
  countAll,
  getSelectedTrue
};

export default dbMonthsMc;
