import Dates from "../../dates/dates";
import { _ } from "underscore";
import addPaBill from "./addPaBill";
import dbFinesPa from "../../../db/dbFinesPa";
import dbMonthsPa from "../../../db/dbMonthsPa";
import dbPaBills from "../../../db/dbPaBills";
import dbResidents from "../../../db/dbResidents";
import updateFinesPa from "../../../data/finesPa/finesPa";
import updateMonthsPa from "../../monthsPa/monthsPa";
import updatePaBill from "./updatePaBill";
import updatePaBillType from "./updatePaBillType";

const editPaBill = async args => {
  const resident = await dbResidents.getById(args.resId);
  const pamonths = await dbMonthsPa.getAll();
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  const month = _.first(
    _.filter(pamonths, pamonth => pamonth.Selected === true)
  );
  const selectedMonth = bill.BillPeriod === "" ? month.Value : bill.BillPeriod;
  return {
    resident,
    bill,
    pamonths,
    selectedMonth
  };
};

export const removePaBill = async args => {
  await dbPaBills.removePaBill(args.resId, { _id: args.billId });
};

const priAccFine = async () => {
  const date = await Dates.effectiveDate();
  await updateFinesPa();
  const months = await dbMonthsPa.getAll();
  const latestMonth = _.first(
    _.filter(months, month => month.Selected === true)
  );
  const fines = await dbFinesPa.getAll();
  const latestFine = _.first(
    _.filter(fines, item => item.PaMonth === latestMonth.Value)
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
  await addPaBill({ billType: "regular", id: resId });
};

const PaBills = {
  sixMonths,
  priAccFine,
  updatePaBillType,
  removePaBill,
  addPaBill,
  editPaBill,
  updatePaBill
};

export default PaBills;
