import connectMongo from "/imports/server/connector";
import moment from "moment";

const insert = async date => {
  const mongo = await connectMongo();
  const id = await new mongo.ObjectID().toString();
  const newDate = moment.utc(date, "DD-MMM-YYYY").toDate();
  await mongo.Holidays.insert({
    _id: id,
    StringValue: date,
    Value: newDate
  });
  await mongo.client.close();
};

const remove = async id => {
  const mongo = await connectMongo();
  await mongo.Holidays.remove({ _id: id });
  await mongo.client.close();
};

const getAll = async () => {
  const mongo = await connectMongo();
  const holidays = await mongo.Holidays.find({})
    .sort({ Value: 1 })
    .toArray();
  await mongo.client.close();
  return holidays;
};

const countFindByValue = async value => {
  const mongo = await connectMongo();
  const out = await mongo.Holidays.find({ StringValue: value }).count();
  await mongo.client.close();
  return out;
};

const dbHolidays = {
  insert,
  remove,
  getAll,
  countFindByValue
};

export default dbHolidays;
