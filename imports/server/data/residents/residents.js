import Accounts from "../../data/accounts/accounts";
import Dates from "../dates/dates";
import McBills from "./mcBills/index";
import PaBills from "./paBills/index";
import RemoResidents from "../remoResidents/remoResidents";
import dbCategories from "../../db/dbCategories";
import dbClasses from "../../db/dbClasses";
import dbMcDetails from "../../db/dbMcDetails";
import dbPaDetails from "../../db/dbPaDetails";
import dbResidents from "/imports/server/db/dbResidents";
import dbRooms from "/imports/server/db/dbRooms";
import dbSaDetails from "../../db/dbSaDetails";
import dbSessions from "../../db/dbSessions";

const updateResident = async args => {
  const suffix = await dbSessions.getSessionSuffix(args.session);
  const rollNumber = args.rollNumber + suffix;
  const room = await dbRooms.getByValue(args.room);
  const clas = await dbClasses.getByValue(args.clas);
  const category = await dbCategories.getByValue(args.category);
  const resInfo = {
    _id: args.resId,
    name: args.name,
    fatherName: args.fatherName,
    rollNumber,
    telephoneNumber: args.telephoneNumber,
    room,
    clas,
    category
  };
  if (resInfo._id === "") {
    await dbResidents.insert(resInfo);
  } else {
    await dbResidents.updateInfo(resInfo);
  }
  return room._id;
};

const getByRoomId = async args => {
  const residents = await dbResidents.getByRoomId(args.roomId);
  return residents;
};

const editResident = async args => {
  let resident = {};
  if (args.resId) {
    resident = await dbResidents.getById(args.resId);
  }
  const rooms = await dbRooms.getAll();
  const categories = await dbCategories.getAll();
  const classes = await dbClasses.getAll();
  const sessions = await dbSessions.getAll();
  return {
    resident,
    rooms,
    categories,
    classes,
    sessions
  };
};

const editReturnAmount = async args => {
  const resIn = await dbResidents.getById(args.id);
  const netDues = resIn.UnpaidTotal - parseInt(args.returnAmount, 10);
  const returnAmount = parseInt(args.returnAmount, 10);
  await dbResidents.updateReturnAmount(args.id, returnAmount, netDues);
  const resOut = await dbResidents.getById(args.id);
  return resOut.ReturnAmount;
};

const getAll = async () => {
  return await dbResidents.getAll();
};

const duesRegularResidents = async () => {
  const residents = await dbResidents.getAllRegularDuesListTrue();
  const duesTotal = {
    SrNo: "",
    Room: "",
    RollNumber: "",
    Name: "",
    MessOne: 0,
    MessTwo: 0,
    Canteen: 0,
    Amenity: 0,
    HalfYearlyMc: 0,
    FinesMc: 0,
    TotalMc: 0,
    RoomRent: 0,
    WaterCharges: 0,
    ElectricityCharges: 0,
    HalfYearlyPa: 0,
    Miscellaneous: 0,
    TotalPa: 0,
    Total: 0
  };
  for (const resident of residents) {
    duesTotal.MessOne += resident.UnpaidMcTotal.MessOne;
    duesTotal.MessTwo += resident.UnpaidMcTotal.MessTwo;
    duesTotal.Canteen += resident.UnpaidMcTotal.Canteen;
    duesTotal.Amenity += resident.UnpaidMcTotal.Amenity;
    duesTotal.HalfYearlyMc += resident.UnpaidMcTotal.HalfYearly;
    duesTotal.FinesMc +=
      resident.UnpaidMcTotal.MessFine +
      resident.UnpaidMcTotal.CanteenFine +
      resident.UnpaidMcTotal.HalfYearlyFine;
    duesTotal.TotalMc += resident.UnpaidMcTotal.Total;
    duesTotal.RoomRent += resident.UnpaidPaTotal.RoomRent;
    duesTotal.WaterCharges += resident.UnpaidPaTotal.WaterCharges;
    duesTotal.ElectricityCharges += resident.UnpaidPaTotal.ElectricityCharges;
    duesTotal.HalfYearlyPa += resident.UnpaidPaTotal.HalfYearly;
    duesTotal.Miscellaneous += resident.UnpaidPaTotal.Miscellaneous;
    duesTotal.TotalPa += resident.UnpaidPaTotal.Total;
    duesTotal.Total += resident.UnpaidTotal;
  }
  return {
    residents,
    duesTotal
  };
};

const residentsRoomWise = async () => {
  const residents = await dbResidents.getAllRoomWise();
  let returnAmount = 0;
  const out = [];
  for (const element of residents) {
    if (element.Room !== undefined) {
      returnAmount += element.ReturnAmount;
      out.push(element);
    }
  }
  return {
    residents: out,
    returnAmount
  };
};

const removeResident = async args => {
  await RemoResidents.create(args.resId);
  await dbResidents.removeResident(args.resId);
  return "Resident Removed";
};

const residentDetails = async args => {
  await Accounts.processAccount(args.id);
  const resi = await dbResidents.getById(args.id);
  const effDate = await Dates.effectiveDate();
  return {
    resident: resi,
    effectiveDate: effDate
  };
};

const duesListTrue = async args => {
  await dbResidents.updateDuesListBool(args.id, true);
  return "Dues List Set To True";
};

const duesListFalse = async args => {
  await dbResidents.updateDuesListBool(args.id, false);
  return "Dues List Set To False";
};

const sixMonths = async args => {
  await PaBills.sixMonths(args.resId);
  await McBills.sixMonths(args.resId);
  await Accounts.processAccount(args.resId);
  return "Six Months Bills Added";
};

const noticeListResidents = async () => {
  const array = await dbResidents.noticeListResidents();
  return array;
};

const noticeListTrue = async args => {
  await dbResidents.updateNoticeListBool(args.resId, true);
  return "Notice List Set To True";
};

const noticeListFalse = async args => {
  await dbResidents.updateNoticeListBool(args.resId, false);
  return "Notice List Set To True";
};

const admissionDetails = async args => {
  const res = await dbResidents.getById(args.resId);
  const paDets = await dbPaDetails.residentAdmissionDetails(args.resId);
  const mcDets = await dbMcDetails.residentAdmissionDetails(args.resId);
  const saDets = await dbSaDetails.residentAdmissionDetails(args.resId);
  return {
    resident: res,
    paDetails: paDets,
    mcDetails: mcDets,
    saDetails: saDets
  };
};

const Residents = {
  admissionDetails,
  updateResident,
  getByRoomId,
  editResident,
  noticeListFalse,
  noticeListTrue,
  noticeListResidents,
  sixMonths,
  editReturnAmount,
  getAll,
  removeResident,
  residentsRoomWise,
  duesRegularResidents,
  residentDetails,
  duesListTrue,
  duesListFalse
};

export default Residents;
