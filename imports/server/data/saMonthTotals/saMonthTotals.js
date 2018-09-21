import { _ } from "underscore";
import dbSaDayTotals from "../../db/dbSaDayTotals";
import dbSaMonthTotals from "../../db/dbSaMonthTotals";
import moment from "moment";

const upsert = async depositMonth => {
  const dayTotals = await dbSaDayTotals.getByDepositMonth(depositMonth);
  const exist = await dbSaMonthTotals.getByDepositMonth(depositMonth);
  if (dayTotals.length === 0 && exist) {
    await dbSaMonthTotals.remove(exist._id);
    return;
  }
  let hostelSecurity = 0;
  let messSecurity = 0;
  let canteenSecurity = 0;
  let total = 0;
  let deposit = 0;
  let excessDeposit = 0;
  const depositDate = _.last(dayTotals).DepositDate;
  _.each(dayTotals, element => {
    hostelSecurity += element.HostelSecurity;
    messSecurity += element.MessSecurity;
    canteenSecurity += element.CanteenSecurity;
    total += element.Total;
    deposit += element.Deposit;
    excessDeposit += element.ExcessDeposit;
  });
  if (exist) {
    exist.HostelSecurity = hostelSecurity;
    exist.MessSecurity = messSecurity;
    exist.CanteenSecurity = canteenSecurity;
    exist.Total = total;
    exist.Deposit = deposit;
    exist.ExcessDeposit = excessDeposit;
    await dbSaMonthTotals.update(exist);
  } else if (dayTotals.length !== 0) {
    const doc = await dbSaMonthTotals.getDefault();
    doc.DepositDate = depositDate;
    doc.DepositMonth = moment.utc(depositDate).format("MMM, YYYY");
    doc.HostelSecurity = hostelSecurity;
    doc.MessSecurity = messSecurity;
    doc.CanteenSecurity = canteenSecurity;
    doc.Total = total;
    doc.Deposit = deposit;
    doc.ExcessDeposit = excessDeposit;
    await dbSaMonthTotals.insert(doc);
  }
};

const autoDeposit = async args => {
  await dbSaDayTotals.autoDepositMonth(args.month);
  await dbSaMonthTotals.autoDeposit(args.month);
  return "SaMonth AutoDeposited";
};

const getByPage = async args => {
  let skipVal = 0;
  if (parseInt(args.pageNo, 10) > 1) {
    skipVal = (parseInt(args.pageNo, 10) - 1) * 15;
  }
  const out = await dbSaMonthTotals.getByPage(skipVal);
  const count = await dbSaMonthTotals.saMonthTotalsCount();
  return {
    monthTotals: out,
    count
  };
};

const getById = async args => {
  const det = await dbSaMonthTotals.getById(args.monthId);
  const details = await dbSaDayTotals.getByDepositMonth(det.DepositMonth);
  const monthCollection = {
    DepositMonth: det.DepositMonth,
    HostelSecurity: 0,
    MessSecurity: 0,
    CanteenSecurity: 0,
    Total: 0,
    ExcessDeposit: 0
  };
  _.each(details, element => {
    monthCollection.HostelSecurity += element.HostelSecurity;
    monthCollection.MessSecurity += element.MessSecurity;
    monthCollection.CanteenSecurity += element.CanteenSecurity;
    monthCollection.Total += element.Total;
    monthCollection.ExcessDeposit += element.ExcessDeposit;
  });
  return {
    details,
    monthCollection
  };
};

const removeByMonth = async args => {
  await dbSaDayTotals.removeByMonth(args.month);
  await dbSaMonthTotals.removeByMonth(args.month);
  return "SaMonth Removed";
};

const SaMonthTotals = {
  removeByMonth,
  upsert,
  autoDeposit,
  getById,
  getByPage
};

export default SaMonthTotals;
