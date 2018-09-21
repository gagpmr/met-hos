import { _ } from "underscore";
import dbMcDayTotals from "../../db/dbMcDayTotals";
import dbMcMonthTotals from "../../db/dbMcMonthTotals";
import moment from "moment";

const upsert = async depositMonth => {
  const dayTotals = await dbMcDayTotals.getByDepositMonth(depositMonth);
  const exist = await dbMcMonthTotals.getByDepositMonth(depositMonth);
  if (dayTotals.length === 0 && exist) {
    await dbMcMonthTotals.remove(exist._id);
    return;
  }
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
  let deposit = 0;
  let excessDeposit = 0;
  const depositDate = _.last(dayTotals).DepositDate;
  _.each(dayTotals, element => {
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
    deposit += element.Deposit;
    excessDeposit += element.ExcessDeposit;
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
    exist.Deposit = deposit;
    exist.ExcessDeposit = excessDeposit;
    await dbMcMonthTotals.update(exist);
  } else if (dayTotals.length !== 0) {
    const doc = await dbMcMonthTotals.getDefault();
    doc.DepositDate = depositDate;
    doc.DepositMonth = moment.utc(depositDate).format("MMM, YYYY");
    doc.MessOne = messOne;
    doc.MessTwo = messTwo;
    doc.Canteen = canteen;
    doc.Fines = fines;
    doc.Amenity = amenity;
    doc.PoorStuWelFund = poorStuWelFund;
    doc.McServantWelFund = mcServantWelFund;
    doc.FoodSubsidy = foodSubsidy;
    doc.CelebrationFund = celebrationFund;
    doc.Total = total;
    doc.Deposit = deposit;
    doc.ExcessDeposit = excessDeposit;
    await dbMcMonthTotals.insert(doc);
  }
};

const autoDeposit = async args => {
  await dbMcDayTotals.autoDepositMonth(args.month);
  await dbMcMonthTotals.autoDeposit(args.month);
  return "McMonth AutoDeposited";
};

const getByPage = async args => {
  let skipVal = 0;
  if (parseInt(args.pageNo, 10) > 1) {
    skipVal = (parseInt(args.pageNo, 10) - 1) * 15;
  }
  const out = await dbMcMonthTotals.getByPage(skipVal);
  const count = await dbMcMonthTotals.monthTotalsCount();
  return {
    monthTotals: out,
    count
  };
};

const getById = async args => {
  const det = await dbMcMonthTotals.getById(args.monthId);
  const details = await dbMcDayTotals.getByDepositMonth(det.DepositMonth);
  const monthCollection = {
    DepositMonth: det.DepositMonth,
    MessOne: 0,
    MessTwo: 0,
    Canteen: 0,
    Fines: 0,
    Amenity: 0,
    PoorStuWelFund: 0,
    McServantWelFund: 0,
    FoodSubsidy: 0,
    CelebrationFund: 0,
    Total: 0,
    Deposit: 0,
    ExcessDeposit: 0
  };
  _.each(details, element => {
    monthCollection.MessOne += element.MessOne;
    monthCollection.MessTwo += element.MessTwo;
    monthCollection.Canteen += element.Canteen;
    monthCollection.Fines += element.Fines;
    monthCollection.Amenity += element.Amenity;
    monthCollection.PoorStuWelFund += element.PoorStuWelFund;
    monthCollection.McServantWelFund += element.McServantWelFund;
    monthCollection.FoodSubsidy += element.FoodSubsidy;
    monthCollection.CelebrationFund += element.CelebrationFund;
    monthCollection.Total += element.Total;
    monthCollection.Deposit += element.Deposit;
    monthCollection.ExcessDeposit += element.ExcessDeposit;
  });
  return {
    details,
    monthCollection
  };
};

const removeByMonth = async args => {
  await dbMcDayTotals.removeByMonth(args.month);
  await dbMcMonthTotals.removeByMonth(args.month);
  return "McMonth Removed";
};

const McMonthTotals = {
  removeByMonth,
  upsert,
  autoDeposit,
  getById,
  getByPage
};

export default McMonthTotals;
