import McMonthTotals from "../mcMonthTotals/mcMonthTotals";
import { _ } from "underscore";
import dbMcDayTotals from "../../db/dbMcDayTotals";
import dbMcDetails from "../../db/dbMcDetails";
import dbMcMonthTotals from "../../db/dbMcMonthTotals";
import moment from "moment";

// Needed only once at start
const createNotExisting = async () => {
  const docs = await dbMcDetails.getAll();
  const disnt = _.uniq(docs, false, det =>
    moment.utc(det.DepositDate).format("DD-MM-YYYY")
  );
  for (let i = 0; i < disnt.length; i++) {
    const element = disnt[i];
    const doc = await dbMcDayTotals.getByDepositDate(element.DepositDate);
    if (!doc) {
      const dateDetails = await dbMcDetails.getForDepositDate(
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
      const nDoc = await dbMcDayTotals.getDefault();
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
      await dbMcDayTotals.insert(nDoc);
    }
  }
};

const upsert = async depositDate => {
  const dets = await dbMcDetails.getForDepositDate(depositDate);
  const exist = await dbMcDayTotals.getByDepositDate(depositDate);
  let messOne = 0;
  let messTwo = 0;
  let canteen = 0;
  let fines = 0;
  let amenity = 0;
  let poorStuWelFund = 0;
  let mcServantWelFund = 0;
  let foodSubsidy = 0;
  let celebrationFund = 0;
  let total = 0;
  _.each(dets, element => {
    messOne += element.MessOne;
    messTwo += element.MessTwo;
    canteen += element.Canteen;
    fines += element.Fines;
    amenity += element.Amenity;
    poorStuWelFund += element.PoorStuWelFund;
    mcServantWelFund += element.McServantWelFund;
    foodSubsidy += element.FoodSubsidy;
    celebrationFund += element.CelebrationFund;
    total += element.Total;
  });
  if (exist) {
    exist.MessOne = messOne;
    exist.MessTwo = messTwo;
    exist.Canteen = canteen;
    exist.Fines = fines;
    exist.Amenity = amenity;
    exist.PoorStuWelFund = poorStuWelFund;
    exist.McServantWelFund = mcServantWelFund;
    exist.FoodSubsidy = foodSubsidy;
    exist.CelebrationFund = celebrationFund;
    exist.Total = total;
    if (exist.Total === 0 && dets.length === 0) {
      await dbMcDayTotals.remove(exist._id);
    } else if (exist.Total !== 0) {
      await dbMcDayTotals.update(exist);
    }
  } else {
    if (dets.length !== 0) {
      const det = await dbMcDayTotals.getDefault();
      det.DepositDate = depositDate;
      det.DepositMonth = moment.utc(depositDate).format("MMM, YYYY");
      det.MessOne = messOne;
      det.MessTwo = messTwo;
      det.Canteen = canteen;
      det.Fines = fines;
      det.Amenity = amenity;
      det.PoorStuWelFund = poorStuWelFund;
      det.McServantWelFund = mcServantWelFund;
      det.FoodSubsidy = foodSubsidy;
      det.CelebrationFund = celebrationFund;
      det.Total = total;
      await dbMcDayTotals.insert(det);
    }
  }
  await McMonthTotals.upsert(moment.utc(depositDate).format("MMM, YYYY"));
};

const getByPage = async args => {
  let skipVal = 0;
  if (parseInt(args.pageNo, 10) > 1) {
    skipVal = (parseInt(args.pageNo, 10) - 1) * 15;
  }
  const out = await dbMcDayTotals.getByPage(skipVal);
  const count = await dbMcDayTotals.mcDayTotalsCount();
  return {
    dayTotals: out,
    count
  };
};

const removeByDate = async args => {
  const date = moment.utc(args.depositDate, "DD-MM-YYYY").toDate();
  await dbMcDayTotals.removeByDate(date);
  await dbMcDetails.removeByDate(date);
  await McMonthTotals.upsert(moment.utc(date).format("MMM, YYYY"));
  return "McDayTotal Removed";
};

const autoDeposit = async args => {
  await dbMcDayTotals.autoDeposit(args.id);
  const out = await dbMcDayTotals.getById(args.id);
  const docs = await dbMcDayTotals.getByDepositMonth(out.detail.DepositMonth);
  let deposit = 0;
  let excessDeposit = 0;
  _.each(docs, element => {
    deposit += element.Deposit;
    excessDeposit += excessDeposit;
  });
  await dbMcMonthTotals.updateMonthDeposit(
    out.detail.DepositMonth,
    deposit,
    excessDeposit
  );
  await McMonthTotals.upsert(out.detail.DepositMonth);
  return "McDayTotal AutoDeposited";
};

const getById = async args => {
  return await dbMcDayTotals.getById(args.detId);
};

const updateMcDayDeposits = async args => {
  const out = await dbMcDayTotals.getById(args.detId);
  const updated = await dbMcDayTotals.updateMcDayDeposits(
    args.detId,
    args.deposit
  );
  await McMonthTotals.upsert(out.detail.DepositMonth);
  return updated;
};

const McDayTotals = {
  createNotExisting,
  upsert,
  updateMcDayDeposits,
  getById,
  autoDeposit,
  removeByDate,
  getByPage
};

export default McDayTotals;
