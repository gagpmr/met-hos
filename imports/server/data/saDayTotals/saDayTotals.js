import SaMonthTotals from "../saMonthTotals/saMonthTotals";
import { _ } from "underscore";
import dbSaDayTotals from "../../db/dbSaDayTotals";
import dbSaDetails from "../../db/dbSaDetails";
import dbSaMonthTotals from "../../db/dbSaMonthTotals";
import moment from "moment";

const upsert = async depositDate => {
  const dets = await dbSaDetails.getForDepositDate(depositDate);
  const exist = await dbSaDayTotals.getByDepositDate(depositDate);
  let hostelSecurity = 0;
  let messSecurity = 0;
  let canteenSecurity = 0;
  let total = 0;
  _.each(dets, element => {
    hostelSecurity += element.HostelSecurity;
    messSecurity += element.MessSecurity;
    canteenSecurity += element.CanteenSecurity;
    total += element.Total;
  });
  if (exist) {
    exist.HostelSecurity = hostelSecurity;
    exist.MessSecurity = messSecurity;
    exist.CanteenSecurity = canteenSecurity;
    exist.Total = total;
    if (exist.Total === 0 && dets.length === 0) {
      await dbSaDayTotals.remove(exist._id);
    } else if (exist.Total !== 0) {
      await dbSaDayTotals.update(exist);
    }
  } else {
    if (dets.length !== 0) {
      const det = await dbSaDayTotals.getDefault();
      det.DepositDate = depositDate;
      det.DepositMonth = moment.utc(depositDate).format("MMM, YYYY");
      det.HostelSecurity = hostelSecurity;
      det.MessSecurity = messSecurity;
      det.CanteenSecurity = canteenSecurity;
      det.Total = total;
      await dbSaDayTotals.insert(det);
    }
  }
  await SaMonthTotals.upsert(moment.utc(depositDate).format("MMM, YYYY"));
};

const getByPage = async args => {
  let skipVal = 0;
  if (parseInt(args.pageNo, 10) > 1) {
    skipVal = (parseInt(args.pageNo, 10) - 1) * 15;
  }
  const out = await dbSaDayTotals.getByPage(skipVal);
  const count = await dbSaDayTotals.saDayTotalsCount();
  return {
    dayTotals: out,
    count
  };
};

const removeByDate = async args => {
  const date = moment.utc(args.depositDate, "DD-MM-YYYY").toDate();
  await dbSaDayTotals.removeByDate(date);
  await dbSaDetails.removeByDate(date);
  await SaMonthTotals.upsert(moment.utc(date).format("MMM, YYYY"));
  return "SaDayTotal Removed";
};

const autoDeposit = async args => {
  await dbSaDayTotals.autoDeposit(args.id);
  const out = await dbSaDayTotals.getById(args.id);
  const docs = await dbSaDayTotals.getByDepositMonth(out.detail.DepositMonth);
  let deposit = 0;
  let excessDeposit = 0;
  _.each(docs, element => {
    deposit += element.Deposit;
    excessDeposit += excessDeposit;
  });
  await dbSaMonthTotals.updateMonthDeposit(
    out.detail.DepositMonth,
    deposit,
    excessDeposit
  );
  await SaMonthTotals.upsert(out.detail.DepositMonth);
  return "SaDayTotal AutoDeposited";
};

const getById = async args => {
  return await dbSaDayTotals.getById(args.detId);
};

const updateSaDayDeposits = async args => {
  const out = await dbSaDayTotals.getById(args.detId);
  const updated = await dbSaDayTotals.updateSaDayDeposits(
    args.detId,
    args.deposit
  );
  await SaMonthTotals.upsert(out.detail.DepositMonth);
  return updated;
};

const SaDayTotals = {
  upsert,
  updateSaDayDeposits,
  getById,
  autoDeposit,
  removeByDate,
  getByPage
};

export default SaDayTotals;
