import { _ } from "underscore";
import dbPaDayTotals from "../../db/dbPaDayTotals";
import dbPaMonthTotals from "../../db/dbPaMonthTotals";
import moment from "moment";

const upsert = async depositMonth => {
  const dayTotals = await dbPaDayTotals.getByDepositMonth(depositMonth);
  const exist = await dbPaMonthTotals.getByDepositMonth(depositMonth);
  if (dayTotals.length === 0 && exist) {
    await dbPaMonthTotals.remove(exist._id);
    return;
  }
  let roomRent = 0;
  let waterCharges = 0;
  let electricityCharges = 0;
  let developmentFund = 0;
  let rutineHstlMaintnceCharges = 0;
  let miscellaneous = 0;
  let total = 0;
  let deposit = 0;
  let excessDeposit = 0;
  const depositDate = _.last(dayTotals).DepositDate;
  _.each(dayTotals, element => {
    roomRent += element.RoomRent;
    waterCharges += element.WaterCharges;
    electricityCharges += element.ElectricityCharges;
    developmentFund += element.DevelopmentFund;
    rutineHstlMaintnceCharges += element.RutineHstlMaintnceCharges;
    miscellaneous += element.Miscellaneous;
    total += element.Total;
    deposit += element.Deposit;
    excessDeposit += element.ExcessDeposit;
  });
  if (exist) {
    exist.RoomRent = roomRent;
    exist.WaterCharges = waterCharges;
    exist.ElectricityCharges = electricityCharges;
    exist.DevelopmentFund = developmentFund;
    exist.RutineHstlMaintnceCharges = rutineHstlMaintnceCharges;
    exist.Miscellaneous = miscellaneous;
    exist.Total = total;
    exist.Deposit = deposit;
    exist.ExcessDeposit = excessDeposit;
    await dbPaMonthTotals.update(exist);
  } else if (dayTotals.length !== 0) {
    const doc = await dbPaMonthTotals.getDefault();
    doc.DepositDate = depositDate;
    doc.DepositMonth = moment.utc(depositDate).format("MMM, YYYY");
    doc.RoomRent = roomRent;
    doc.WaterCharges = waterCharges;
    doc.ElectricityCharges = electricityCharges;
    doc.DevelopmentFund = developmentFund;
    doc.RutineHstlMaintnceCharges = rutineHstlMaintnceCharges;
    doc.Miscellaneous = miscellaneous;
    doc.Total = total;
    doc.Deposit = deposit;
    doc.ExcessDeposit = excessDeposit;
    await dbPaMonthTotals.insert(doc);
  }
};

const autoDeposit = async args => {
  await dbPaDayTotals.autoDepositMonth(args.month);
  await dbPaMonthTotals.autoDeposit(args.month);
  return "PaMonth AutoDeposited";
};

const getByPage = async args => {
  let skipVal = 0;
  if (parseInt(args.pageNo, 10) > 1) {
    skipVal = (parseInt(args.pageNo, 10) - 1) * 15;
  }
  const out = await dbPaMonthTotals.getByPage(skipVal);
  const count = await dbPaMonthTotals.saMonthTotalsCount();
  return {
    monthTotals: out,
    count
  };
};

const getById = async args => {
  const det = await dbPaMonthTotals.getById(args.monthId);
  const details = await dbPaDayTotals.getByDepositMonth(det.DepositMonth);
  const monthCollection = {
    DepositMonth: det.DepositMonth,
    RoomRent: 0,
    WaterCharges: 0,
    ElectricityCharges: 0,
    DevelopmentFund: 0,
    RutineHstlMaintnceCharges: 0,
    Miscellaneous: 0,
    Total: 0,
    Deposit: 0,
    ExcessDeposit: 0
  };
  _.each(details, element => {
    monthCollection.RoomRent += element.RoomRent;
    monthCollection.WaterCharges += element.WaterCharges;
    monthCollection.ElectricityCharges += element.ElectricityCharges;
    monthCollection.DevelopmentFund += element.DevelopmentFund;
    monthCollection.RutineHstlMaintnceCharges +=
      element.RutineHstlMaintnceCharges;
    monthCollection.Miscellaneous += element.Miscellaneous;
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
  await dbPaDayTotals.removeByMonth(args.month);
  await dbPaMonthTotals.removeByMonth(args.month);
  return "PaMonth Removed";
};

const PaMonthTotals = {
  removeByMonth,
  upsert,
  autoDeposit,
  getById,
  getByPage
};

export default PaMonthTotals;
