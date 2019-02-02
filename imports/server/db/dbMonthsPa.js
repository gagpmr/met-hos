import connectMongo from "../../server/connector";

const setAllFalse = async () => {
  const mongo = await connectMongo();
  await mongo.MonthsPa.update(
    {},
    {
      $set: {
        Selected: false
      }
    }
  );
  await mongo.client.close();
};

const getAll = async () => {
  const mongo = await connectMongo();
  const months = await mongo.MonthsPa.find().toArray();
  await mongo.client.close();
  return months;
};

const countGetByMonth = async month => {
  const mongo = await connectMongo();
  const count = await mongo.MonthsPa.find({ Value: month }).count();
  await mongo.client.close();
  return count;
};

const insert = async month => {
  const mongo = await connectMongo();
  const count = await countGetByMonth(month.Value);
  if (count === 0) {
    await mongo.MonthsPa.insert(month);
  } else {
    await mongo.MonthsPa.remove({ Value: month.Value });
    await mongo.MonthsPa.insert(month);
  }
  await mongo.client.close();
};

const getByMonth = async month => {
  const mongo = await connectMongo();
  const monthOut = await mongo.MonthsPa.findOne({ Value: month });
  await mongo.client.close();
  return monthOut;
};

const getSelectedTrue = async () => {
  const mongo = await connectMongo();
  const paMonth = await mongo.MonthsPa.findOne({ Selected: true });
  await mongo.client.close();
  return paMonth;
};

const getAny = async () => {
  const mongo = await connectMongo();
  const monthOut = await mongo.MonthsPa.findOne();
  await mongo.client.close();
  return monthOut;
};

const countAll = async () => {
  const mongo = await connectMongo();
  const count = await mongo.MonthsPa.find().count();
  await mongo.client.close();
  return count;
};

const dbMonthsPa = {
  setAllFalse,
  getAll,
  insert,
  getByMonth,
  countAll,
  countGetByMonth,
  getAny,
  getSelectedTrue
};

export default dbMonthsPa;
