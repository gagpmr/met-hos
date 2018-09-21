import connectMongo from "/imports/server/connector";

const getAll = async () => {
  const mongo = await connectMongo();
  const fines = await mongo.FinesMc.find().toArray();
  await mongo.client.close();
  return fines;
};

const getByMonth = async month => {
  const mongo = await connectMongo();
  const fine = await mongo.FinesMc.findOne({ McMonth: month });
  await mongo.client.close();
  return fine;
};

const countFindByMonthAndEffectiveDate = async (month, effectiveDateStr) => {
  const mongo = await connectMongo();
  let count = 0;
  count = await mongo.FinesMc.find({
    McMonth: month,
    EffectiveDateStr: effectiveDateStr
  }).count();
  await mongo.client.close();
  return count;
};

const insert = async fine => {
  const mongo = await connectMongo();
  await mongo.FinesMc.insert(fine);
  await mongo.client.close();
};

const remove = async id => {
  const mongo = await connectMongo();
  await mongo.FinesMc.remove({ _id: id });
  await mongo.client.close();
};

const dbFinesMc = {
  getAll,
  countFindByMonthAndEffectiveDate,
  insert,
  remove,
  getByMonth
};

export default dbFinesMc;
