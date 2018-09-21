import Accounts from "/imports/server/data/accounts/accounts";
import dbFinesPa from "/imports/server/db/dbFinesPa";
import dbMonthsPa from "/imports/server/db/dbMonthsPa";
import dbPaBills from "/imports/server/db/dbPaBills";
import dbResidents from "/imports/server/db/dbResidents";
import dbSessions from "/imports/server/db/dbSessions";
import moment from "moment";
import updateFinesPa from "/imports/server/data/finesPa/finesPa";

const updatePaContinuationOrDailyBill = async args => {
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  bill.BillPeriod = `Upto ${args.endDate}`;
  bill.StartDate = moment.utc(args.startDate, "DD-MM-YYYY").toDate();
  bill.EndDate = moment.utc(args.endDate, "DD-MM-YYYY").toDate();
  const noOfDays = (bill.EndDate - bill.StartDate) / (1000 * 60 * 60 * 24) + 1;
  bill.BillPeriod += ` (${noOfDays}  Days)`;
  const session = await dbSessions.getCurrentSession();
  switch (args.billType) {
    case "daily":
      bill.HalfYearly = noOfDays * (session.DailyCharges / 4);
      bill.Miscellaneous = noOfDays * ((session.DailyCharges * 3) / 4);
      break;
    case "continuation":
      bill.HalfYearly = noOfDays * (session.ContinuationCharges / 4);
      bill.Miscellaneous = noOfDays * ((session.ContinuationCharges * 3) / 4);
      break;
    default:
      bill.Miscellaneous = 0;
  }
  const remainder = noOfDays % 3;
  if (remainder === 0) {
    bill.ElectricityCharges = Math.round(
      (noOfDays / 30) * session.ElectricityCharges
    );
    bill.Total = bill.Miscellaneous + bill.ElectricityCharges + bill.HalfYearly;
  } else {
    const newDays = noOfDays - remainder;
    bill.ElectricityCharges = Math.round(
      (newDays / 3) * (session.ElectricityCharges / 10)
    );
    const roundedElectCharges = Math.round(session.ElectricityCharges / 30);
    bill.ElectricityCharges =
      bill.ElectricityCharges + remainder * roundedElectCharges;
    bill.Total = bill.Miscellaneous + bill.ElectricityCharges + bill.HalfYearly;
  }
  await dbPaBills.replacePaBill(args.resId, bill);
  await Accounts.processAccount(args.resId);
  return bill;
};

const updatePaElectricityBill = async args => {
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  bill.ElectricityCharges = args.electricity;
  bill.Total = args.electricity;
  const nBill = await dbPaBills.replacePaBill(args.resId, bill);
  await Accounts.processAccount(args.resId);
  return nBill;
};

const updatePaRegularBill = async args => {
  await updateFinesPa();
  const resi = await dbResidents.getById(args.resId);
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  const pamonth = await dbMonthsPa.getByMonth(args.billPeriod);
  const pafine = await dbFinesPa.getByMonth(args.billPeriod);
  const zeroroomrent =
    resi.Category.Value === "SC" || resi.Category.Value === "ST";
  if (!zeroroomrent) {
    bill.RoomRent = pamonth.RoomRent;
  } else {
    bill.RoomRent = 0;
  }
  let fine = 0;
  if (pafine) {
    fine = pafine.Pa;
  }
  const total =
    bill.RoomRent +
    pamonth.WaterCharges +
    pamonth.ElectricityCharges +
    fine +
    pamonth.HalfYearly;
  const billOne = {
    _id: args.billId,
    Type: "Regular",
    BillPeriod: pamonth.Value,
    RoomRent: bill.RoomRent,
    WaterCharges: pamonth.WaterCharges,
    ElectricityCharges: pamonth.ElectricityCharges,
    Miscellaneous: fine,
    HalfYearly: pamonth.HalfYearly,
    Security: 0,
    Total: total,
    SrNo: bill.SrNo
  };
  const nBill = await dbPaBills.replacePaBill(args.resId, billOne);
  await Accounts.processAccount(args.resId);
  return nBill;
};

const updatePaMiscBill = async args => {
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  bill.Miscellaneous = args.misc;
  bill.Total = args.misc;
  const nBill = await dbPaBills.replacePaBill(args.resId, bill);
  await Accounts.processAccount(args.resId);
  return nBill;
};

const updatePaPhdHraBill = async args => {
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  bill.Miscellaneous = args.misc;
  bill.Total = args.misc;
  bill.BillPeriod = args.billPeriod;
  const nBill = await dbPaBills.replacePaBill(args.resId, bill);
  await Accounts.processAccount(args.resId);
  return nBill;
};

const updatePaSecurityBill = async args => {
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  bill.Security = args.security;
  bill.Total = args.security;
  bill.BillPeriod = args.billPeriod;
  const nBill = await dbPaBills.replacePaBill(args.resId, bill);
  await Accounts.processAccount(args.resId);
  return nBill;
};

const updatePaBill = async args => {
  let paBill = {};
  switch (args.billType) {
    case "daily":
      paBill = await updatePaContinuationOrDailyBill(args);
      break;
    case "regular":
      paBill = await updatePaRegularBill(args);
      break;
    case "electricity":
      paBill = await updatePaElectricityBill(args);
      break;
    case "nightStay":
      paBill = await updatePaMiscBill(args);
      break;
    case "fineWarden":
      paBill = await updatePaMiscBill(args);
      break;
    case "continuation":
      paBill = await updatePaContinuationOrDailyBill(args);
      break;
    case "phdHra":
      paBill = await updatePaPhdHraBill(args);
      break;
    case "security":
      paBill = await updatePaSecurityBill(args);
      break;
    default:
      console.log("Default: UpdatePaBill");
  }
  return paBill;
};

export default updatePaBill;
