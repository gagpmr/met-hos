import PaMonthTotals from "../paMonthTotals/paMonthTotals";
import { _ } from "underscore";
import dbPaDayTotals from "../../db/dbPaDayTotals";
import dbPaDetails from "../../db/dbPaDetails";
import dbPaMonthTotals from "../../db/dbPaMonthTotals";
import moment from "moment";

// Needed only once at start
const createNotExisting = async () => {
  const docs = await dbPaDetails.getAll();
  const disnt = _.uniq(docs, false, det =>
    moment.utc(det.DepositDate).format("DD-MM-YYYY")
  );
  for (let i = 0; i < disnt.length; i++) {
    const element = disnt[i];
    const doc = await dbPaDayTotals.getByDepositDate(element.DepositDate);
    const dateDetails = await dbPaDetails.getForDepositDate(
      element.DepositDate
    );
    let roomRent = 0;
    let waterCharges = 0;
    let electricityCharges = 0;
    let developmentFund = 0;
    let rutineHstlMaintnceCharges = 0;
    let miscellaneous = 0;
    let celebrationFund = 0;
    let total = 0;
    _.each(dateDetails, ndoc => {
      roomRent += ndoc.RoomRent;
      waterCharges += ndoc.WaterCharges;
      electricityCharges += ndoc.ElectricityCharges;
      developmentFund += ndoc.DevelopmentFund;
      rutineHstlMaintnceCharges += ndoc.RutineHstlMaintnceCharges;
      miscellaneous += ndoc.Miscellaneous;
      celebrationFund += ndoc.CelebrationFund;
      total += ndoc.Total;
    });
    if (doc === null) {
      const nDoc = await dbPaDayTotals.getDefault();
      nDoc.DepositDate = element.DepositDate;
      nDoc.DepositMonth = moment.utc(element.DepositDate).format("MMM, YYYY");
      nDoc.RoomRent = roomRent;
      nDoc.WaterCharges = waterCharges;
      nDoc.ElectricityCharges = electricityCharges;
      nDoc.DevelopmentFund = developmentFund;
      nDoc.RutineHstlMaintnceCharges = rutineHstlMaintnceCharges;
      nDoc.Miscellaneous = miscellaneous;
      nDoc.CelebrationFund = celebrationFund;
      nDoc.Total = total;
      await dbPaDayTotals.insert(nDoc);
    }
  }
};

const upsert = async depositDate => {
  const dets = await dbPaDetails.getForDepositDate(depositDate);
  const exist = await dbPaDayTotals.getByDepositDate(depositDate);
  let roomRent = 0;
  let waterCharges = 0;
  let electricityCharges = 0;
  let developmentFund = 0;
  let rutineHstlMaintnceCharges = 0;
  let miscellaneous = 0;
  let total = 0;
  _.each(dets, element => {
    roomRent += element.RoomRent;
    waterCharges += element.WaterCharges;
    electricityCharges += element.ElectricityCharges;
    developmentFund += element.DevelopmentFund;
    rutineHstlMaintnceCharges += element.RutineHstlMaintnceCharges;
    miscellaneous += element.Miscellaneous;
    total += element.Total;
  });
  if (exist) {
    exist.RoomRent = roomRent;
    exist.WaterCharges = waterCharges;
    exist.ElectricityCharges = electricityCharges;
    exist.DevelopmentFund = developmentFund;
    exist.RutineHstlMaintnceCharges = rutineHstlMaintnceCharges;
    exist.Miscellaneous = miscellaneous;
    exist.Total = total;
    if (exist.Total === 0 && dets.length === 0) {
      await dbPaDayTotals.remove(exist._id);
    } else if (exist.Total !== 0) {
      await dbPaDayTotals.update(exist);
    }
  } else {
    if (dets.length !== 0) {
      const det = await dbPaDayTotals.getDefault();
      det.DepositDate = depositDate;
      det.DepositMonth = moment.utc(depositDate).format("MMM, YYYY");
      det.RoomRent = roomRent;
      det.WaterCharges = waterCharges;
      det.ElectricityCharges = electricityCharges;
      det.DevelopmentFund = developmentFund;
      det.RutineHstlMaintnceCharges = rutineHstlMaintnceCharges;
      det.Miscellaneous = miscellaneous;
      det.Total = total;
      await dbPaDayTotals.insert(det);
    }
  }
  await PaMonthTotals.upsert(moment.utc(depositDate).format("MMM, YYYY"));
};

const getByPage = async args => {
  let skipVal = 0;
  if (parseInt(args.pageNo, 10) > 1) {
    skipVal = (parseInt(args.pageNo, 10) - 1) * 15;
  }
  const out = await dbPaDayTotals.getByPage(skipVal);
  const count = await dbPaDayTotals.paDayTotalsCount();
  return {
    dayTotals: out,
    count
  };
};

const removeByDate = async args => {
  const date = moment.utc(args.depositDate, "DD-MM-YYYY").toDate();
  await dbPaDayTotals.removeByDate(date);
  await dbPaDetails.removeByDate(date);
  await PaMonthTotals.upsert(moment.utc(date).format("MMM, YYYY"));
  return "PaDayTotal Removed";
};

const autoDeposit = async args => {
  await dbPaDayTotals.autoDeposit(args.id);
  const out = await dbPaDayTotals.getById(args.id);
  const docs = await dbPaDayTotals.getByDepositMonth(out.detail.DepositMonth);
  let deposit = 0;
  let excessDeposit = 0;
  _.each(docs, element => {
    deposit += element.Deposit;
    excessDeposit += excessDeposit;
  });
  await dbPaMonthTotals.updateMonthDeposit(
    out.detail.DepositMonth,
    deposit,
    excessDeposit
  );
  await PaMonthTotals.upsert(out.detail.DepositMonth);
  return "PaDayTotal AutoDeposited";
};

const getById = async args => {
  return await dbPaDayTotals.getById(args.detId);
};

const updatePaDayDeposits = async args => {
  const out = await dbPaDayTotals.getById(args.detId);
  const updated = await dbPaDayTotals.updatePaDayDeposits(
    args.detId,
    args.deposit
  );
  await PaMonthTotals.upsert(out.detail.DepositMonth);
  return updated;
};

const PaDayTotals = {
  createNotExisting,
  upsert,
  updatePaDayDeposits,
  getById,
  autoDeposit,
  removeByDate,
  getByPage
};

export default PaDayTotals;
