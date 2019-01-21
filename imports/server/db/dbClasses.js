import { _ } from "underscore";
import connectMongo from "../../server/connector";

const getByValue = async value => {
  const mongo = await connectMongo();
  const clas = await mongo.Classes.findOne({ Value: value });
  await mongo.client.close();
  return clas;
};

const getAll = async () => {
  const mongo = await connectMongo();
  const classes = await mongo.Classes.find({})
    .sort({ SrNo: 1 })
    .toArray();
  await mongo.client.close();
  return classes;
};

const remove = async classId => {
  const mongo = await connectMongo();
  const clas = await mongo.Classes.findOne({ _id: classId });
  await mongo.Classes.update(
    { SrNo: { $gt: clas.SrNo } },
    {
      $inc: { SrNo: -1 }
    },
    { multi: true }
  );
  await mongo.Classes.remove({ _id: classId });
  await mongo.client.close();
};

const insert = async (classId, srNo) => {
  const mongo = await connectMongo();
  const clas = await mongo.Classes.findOne({ _id: classId });
  await mongo.Classes.update(
    { SrNo: { $gt: srNo } },
    {
      $inc: { SrNo: 1 }
    },
    { multi: true }
  );
  await mongo.Classes.update(
    {},
    {
      $set: { Focus: false }
    }
  );
  const srNoInt = parseInt(clas.SrNo, 10) + 1;
  const clasValue = `${clas.Value} - Copy`;
  const id = await new mongo.ObjectID().toString();
  await mongo.Classes.insert({
    _id: id,
    Value: clasValue,
    SrNo: srNoInt,
    Focus: true
  });
  await mongo.client.close();
};

const srNoDown = async (classId, srNo) => {
  const nSrNo = srNo - 1;
  const mongo = await connectMongo();
  await mongo.Classes.update(
    { SrNo: nSrNo },
    {
      $set: { SrNo: srNo }
    }
  );
  await mongo.Classes.update(
    { _id: classId },
    {
      $set: { SrNo: nSrNo }
    }
  );
};

const srNoUp = async (classId, srNo) => {
  const nSrNo = srNo + 1;
  const mongo = await connectMongo();
  await mongo.Classes.update(
    { SrNo: nSrNo },
    {
      $set: { SrNo: srNo }
    }
  );
  await mongo.Classes.update(
    { _id: classId },
    {
      $set: { SrNo: nSrNo }
    }
  );
};

const srNoMax = async (classId, srNo) => {
  const mongo = await connectMongo();
  const maxClass = await mongo.Classes.find({})
    .sort({ SrNo: -1 })
    .limit(1)
    .toArray();
  const nMaxSrNo = _.first(maxClass).SrNo + 1;
  await mongo.Classes.update(
    { _id: classId },
    {
      $set: { SrNo: nMaxSrNo }
    }
  );
  await mongo.Classes.update(
    { SrNo: { $gt: srNo } },
    {
      $inc: { SrNo: -1 }
    },
    { multi: true }
  );
};

const getById = async classId => {
  const mongo = await connectMongo();
  const clas = await mongo.Classes.findOne({ _id: classId });
  await mongo.client.close();
  return clas;
};

const updateValue = async (classId, value) => {
  const mongo = await connectMongo();
  await mongo.Classes.update(
    { Focus: true },
    {
      $set: { Focus: false }
    }
  );
  await mongo.Classes.update(
    { _id: classId },
    {
      $set: { Value: value, Focus: true }
    }
  );
  await mongo.client.close();
};

const dbClasses = {
  updateValue,
  getById,
  srNoMax,
  srNoUp,
  srNoDown,
  insert,
  remove,
  getByValue,
  getAll
};

export default dbClasses;
