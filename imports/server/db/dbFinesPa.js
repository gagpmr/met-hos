import connectMongo from "/imports/server/connector";

const getAll = async () => {
  const mongo = await connectMongo();
  const fines = await mongo.FinesPa.find().toArray();
  await mongo.client.close();
  return fines;
};

const getByMonth = async month => {
  const mongo = await connectMongo();
  const fine = await mongo.FinesPa.findOne({ PaMonth: month });
  await mongo.client.close();
  return fine;
};

const countFindByMonthAndEffectiveDate = async (month, effectiveDateStr) => {
  const mongo = await connectMongo();
  let count = 0;
  count = await mongo.FinesPa.find({
    PaMonth: month,
    EffectiveDateStr: effectiveDateStr
  }).count();
  await mongo.client.close();
  return count;
};

const insert = async fine => {
  const mongo = await connectMongo();
  await mongo.FinesPa.insert(fine);
  await mongo.client.close();
};

const remove = async id => {
  const mongo = await connectMongo();
  await mongo.FinesPa.remove({ _id: id });
  await mongo.client.close();
};

const dbFinesPa = {
  getAll,
  insert,
  remove,
  getByMonth,
  countFindByMonthAndEffectiveDate
};

export default dbFinesPa;
