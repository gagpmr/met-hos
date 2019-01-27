import { _ } from "underscore";
import connectMongo from "../../server/connector";

const getByRoomId = async roomId => {
  const mongo = await connectMongo();
  const residents = await mongo.Residents.find({ "Room._id": roomId })
    .sort({ "Room.Value": 1 })
    .toArray();
  await mongo.client.close();
  return residents;
};

const getById = async id => {
  const mongo = await connectMongo();
  const resi = await mongo.Residents.findOne({ _id: id });
  await mongo.client.close();
  return resi;
};

const getAll = async () => {
  const mongo = await connectMongo();
  const array = await mongo.Residents.find().toArray();
  await mongo.client.close();
  return array;
};

const getAllRoomWise = async () => {
  const mongo = await connectMongo();
  const array = await mongo.Residents.find()
    .sort({ "Room.Value": 1 })
    .toArray();
  await mongo.client.close();
  return array;
};

const removeResident = async resId => {
  const mongo = await connectMongo();
  await mongo.Residents.remove({
    _id: resId
  });
  await mongo.client.close();
};

const replaceResident = async resident => {
  const mongo = await connectMongo();
  await removeResident(resident._id);
  await mongo.Residents.insert(resident);
  await mongo.client.close();
};

const updateDuesListBool = async (resId, value) => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    { _id: resId },
    {
      $set: {
        DuesList: value
      }
    }
  );
  await mongo.client.close();
};

const replaceUnpaidMcTotal = async (resId, unpaidMcTotal) => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    {
      _id: resId
    },
    {
      $set: {
        UnpaidMcTotal: unpaidMcTotal
      }
    }
  );
  await mongo.client.close();
};

const replaceUnpaidPaTotal = async (resId, unpaidPaTotal) => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    {
      _id: resId
    },
    {
      $set: {
        UnpaidPaTotal: unpaidPaTotal
      }
    }
  );
  await mongo.client.close();
};

const updateReturnAmount = async (resId, returnAmount, netDues) => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    { _id: resId },
    {
      $set: {
        ReturnAmount: returnAmount,
        NetDues: netDues
      }
    }
  );
  await mongo.client.close();
};

const getAllRegularDuesListTrue = async () => {
  const mongo = await connectMongo();
  const residents = await mongo.Residents.find({ DuesList: true })
    .sort({ RollNumber: 1 })
    .toArray();
  const out = _.filter(
    residents,
    resident => !resident.RollNumber.includes("-D")
  );
  await mongo.client.close();
  return out;
};

const noticeListResidents = async () => {
  const mongo = await connectMongo();
  const residents = await mongo.Residents.find({ NoticeList: true })
    .sort({ "Room.Value": 1 })
    .toArray();
  const out = _.filter(
    residents,
    resident => !resident.RollNumber.includes("-D")
  );
  await mongo.client.close();
  return out;
};

const updateNoticeListBool = async (resId, value) => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    { _id: resId },
    {
      $set: {
        NoticeList: value
      }
    }
  );
  await mongo.client.close();
};

const updateInfo = async resInfo => {
  const mongo = await connectMongo();
  await mongo.Residents.update(
    { _id: resInfo._id },
    {
      $set: {
        Name: resInfo.name,
        FatherName: resInfo.fatherName,
        RollNumber: resInfo.rollNumber,
        TelephoneNumber: resInfo.telephoneNumber,
        Room: resInfo.room,
        Class: resInfo.clas,
        Category: resInfo.category
      }
    }
  );
  await mongo.client.close();
};

const insert = async resInfo => {
  const mongo = await connectMongo();
  const id = await new mongo.ObjectID().toString();
  await mongo.Residents.insert({
    _id: id,
    Name: resInfo.name,
    FatherName: resInfo.fatherName,
    RollNumber: resInfo.rollNumber,
    TelephoneNumber: resInfo.telephoneNumber,
    Room: resInfo.room,
    Class: resInfo.clas,
    Category: resInfo.category
  });
  await mongo.client.close();
  return id;
};

const getDuesListMessOne = async () => {
  const mongo = await connectMongo();
  const residents = await mongo.Residents.find({
    DuesList: true,
    "UnpaidMcTotal.MessOne": { $gt: 0 }
  })
    .sort({ "UnpaidMcTotal.MessOne": -1 })
    .toArray();
  const out = _.filter(
    residents,
    resident => !resident.RollNumber.includes("-D")
  );
  await mongo.client.close();
  return out;
};

const getDuesListMessTwo = async () => {
  const mongo = await connectMongo();
  const residents = await mongo.Residents.find({
    DuesList: true,
    "UnpaidMcTotal.MessTwo": { $gt: 0 }
  })
    .sort({ "UnpaidMcTotal.MessTwo": -1 })
    .toArray();
  const out = _.filter(
    residents,
    resident => !resident.RollNumber.includes("-D")
  );
  await mongo.client.close();
  return out;
};

const getDuesListCanteen = async () => {
  const mongo = await connectMongo();
  const residents = await mongo.Residents.find({
    DuesList: true,
    "UnpaidMcTotal.Canteen": { $gt: 0 }
  })
    .sort({ "UnpaidMcTotal.Canteen": -1 })
    .toArray();
  const out = _.filter(
    residents,
    resident => !resident.RollNumber.includes("-D")
  );
  await mongo.client.close();
  return out;
};

const dbResidents = {
  insert,
  updateInfo,
  getByRoomId,
  updateNoticeListBool,
  noticeListResidents,
  getAll,
  getById,
  getAllRoomWise,
  removeResident,
  replaceResident,
  updateReturnAmount,
  replaceUnpaidMcTotal,
  replaceUnpaidPaTotal,
  updateDuesListBool,
  getAllRegularDuesListTrue,
  getDuesListMessOne,
  getDuesListMessTwo,
  getDuesListCanteen
};

export default dbResidents;
