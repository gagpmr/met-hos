import Accounts from "../../../data/accounts/accounts";
import Dates from "../../dates/dates";
import { _ } from "underscore";
import dbFinesMc from "../../../db/dbFinesMc";
import dbMcBills from "../../../db/dbMcBills";
import dbMonthsMc from "../../../db/dbMonthsMc";
import dbResidents from "../../../db/dbResidents";
import dbSessions from "../../../db/dbSessions";
import updateFinesMc from "../../../data/finesMc/finesMc";
import updateMcBill from "./updateMcBill";
import updateMcBillType from "./updateMcBillType";

const editMcBill = async args => {
  await updateFinesMc();
  const resident = await dbResidents.getById(args.resId);
  const mcmonths = await dbMonthsMc.getAll();
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  const month = _.first(
    _.filter(mcmonths, mcmonth => mcmonth.Selected === true)
  );
  const selectedMonth = bill.BillPeriod === "" ? month.Value : bill.BillPeriod;
  return {
    resident,
    bill,
    mcmonths,
    selectedMonth
  };
};

const addMcBill = async args => {
  await updateFinesMc();
  const mcMonth = await dbMonthsMc.getSelectedTrue();
  const SrNo = await dbMcBills.nextSrNo(args.id);
  const mcBill = {
    MessOne: 0,
    MessTwo: 0,
    Canteen: 0,
    MessFine: 0,
    CanteenFine: 0,
    Amenity: 0,
    Total: 0,
    HalfYearly: 0,
    HalfYearlyFine: 0,
    BillPeriod: mcMonth.Value,
    Type: "FullBill",
    IsPaid: false,
    HasMessFine: true,
    HasCanteenFine: true,
    SrNo
  };
  const billId = await dbMcBills.insertMcBill(args.id, mcBill);
  await Accounts.processAccount(args.id);
  return billId;
};

const removeMcBill = async args => {
  await dbMcBills.removeMcBill(args.resId, { _id: args.billId });
};

const mesCanFine = async () => {
  const date = await Dates.effectiveDate();
  await updateFinesMc();
  const months = await dbMonthsMc.getAll();
  const latestMonth = _.first(
    _.filter(months, month => month.Selected === true)
  );
  const fines = await dbFinesMc.getAll();
  const latestFine = _.first(
    _.filter(fines, item => item.McMonth === latestMonth.Value)
  );
  return {
    date,
    months,
    fines,
    latestFine,
    latestMonth
  };
};

const sixMonths = async resId => {
  const bill = await dbMcBills.getDefault();
  const sess = await dbSessions.getCurrentSession();
  const hy =
    sess.PoorStuWelFund +
    sess.McServantWelFund +
    sess.FoodSubsidy +
    sess.CelebrationFund;
  bill.BillPeriod = "Half Yearly";
  bill.Type = "HalfYearly";
  bill.Total = hy;
  bill.HalfYearly = hy;
  bill.SrNo = await dbMcBills.nextSrNo(resId);
  await dbMcBills.insertMcBill(resId, bill);
};

const McBills = {
  sixMonths,
  mesCanFine,
  updateMcBillType,
  removeMcBill,
  addMcBill,
  editMcBill,
  updateMcBill
};

export default McBills;
