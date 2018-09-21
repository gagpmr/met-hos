import Dates from "../../data/dates/dates";
import PaDetailsGet from "../paDetails/paDetailsGet";
import dbPaBills from "../../db/dbPaBills";
import dbPaDetailBills from "../../db/dbPaDetailBills";
import dbPaDetails from "../../db/dbPaDetails";
import dbResidents from "../../db/dbResidents";
import dbSessions from "../../db/dbSessions";
import dbTxnPaBills from "../../db/dbTxnPaBills";

const fromDailyOrContinuation = async args => {
  const det = await dbPaDetails.getDefault();
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  det.ElectricityCharges = bill.ElectricityCharges;
  det.Miscellaneous = bill.Miscellaneous;
  det.DevelopmentFund = bill.HalfYearly;
  return det;
};

const fromElectricityBill = async args => {
  const det = await dbPaDetails.getDefault();
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  det.ElectricityCharges = bill.ElectricityCharges;
  return det;
};

const fromNightStayOrFineWarden = async args => {
  const det = await dbPaDetails.getDefault();
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  det.Miscellaneous = bill.Miscellaneous;
  return det;
};

const fromPhdHraBill = async args => {
  const det = await dbPaDetails.getDefault();
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  const multiplier = bill.Miscellaneous / 4800;
  det.DevelopmentFund = multiplier * 500;
  det.RutineHstlMaintnceCharges = multiplier * 4300;
  return det;
};

const fromSecurityBill = async args => {
  const det = await dbPaDetails.getDefault();
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  det.Security = bill.Security;
  return det;
};

const fromRegularBill = async args => {
  const det = await dbPaDetails.getDefault();
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  det.RoomRent = bill.RoomRent;
  det.WaterCharges = bill.WaterCharges;
  det.ElectricityCharges = bill.ElectricityCharges;
  det.Miscellaneous = bill.Miscellaneous;
  const sess = await dbSessions.getCurrentSession();
  const hySixMonths = sess.DevelopmentFund + sess.RutineHstlMaintnceCharges;
  const hyThreeMonths = hySixMonths / 2;
  if (bill.HalfYearly === hySixMonths) {
    det.DevelopmentFund = sess.DevelopmentFund;
    det.RutineHstlMaintnceCharges = sess.RutineHstlMaintnceCharges;
  } else if (bill.HalfYearly === hyThreeMonths) {
    det.DevelopmentFund = sess.DevelopmentFund / 2;
    det.RutineHstlMaintnceCharges = sess.RutineHstlMaintnceCharges / 2;
  }
  return det;
};

const getDetail = async args => {
  let det = {};
  switch (args.billType) {
    case "Daily":
      det = await fromDailyOrContinuation(args);
      break;
    case "Regular":
      det = await fromRegularBill(args);
      break;
    case "Electricity":
      det = await fromElectricityBill(args);
      break;
    case "NightStay":
      det = await fromNightStayOrFineWarden(args);
      break;
    case "FineWarden":
      det = await fromNightStayOrFineWarden(args);
      break;
    case "Continuation":
      det = await fromDailyOrContinuation(args);
      break;
    case "PhdHra":
      det = await fromPhdHraBill(args);
      break;
    case "Security":
      det = await fromSecurityBill(args);
      break;
    case "HalfYearly":
      det = await fromRegularBill(args);
      break;
    case "Quarterly":
      det = await fromRegularBill(args);
      break;
    default:
      console.log("Default: Get Pa Detail");
  }
  return det;
};

const insert = async (detail, bill, resId) => {
  const ef = await Dates.effectiveDate();
  const rNum = await PaDetailsGet.nextReceiptNumber();
  const res = await dbResidents.getById(resId);
  const det = Object.assign({}, detail);
  det.ReceiptDate = ef.EffectiveDate;
  det.DepositDate = ef.EffectiveDate;
  det.ResidentId = resId;
  det.ReceiptNumber = rNum;
  det.Name = res.Name;
  det.RoomNumber = res.Room.Value;
  det.RollNumber = res.RollNumber;
  det.Focus = true;
  det.Total = bill.Total;
  await dbPaDetails.insert(det);
  const defBill = await dbPaDetailBills.getDefault();
  defBill.DetailId = det._id;
  defBill.ResidentId = resId;
  defBill.BillPeriod = bill.BillPeriod;
  defBill.Type = bill.Type;
  defBill.Security = bill.Security;
  defBill.RoomRent = bill.RoomRent;
  defBill.WaterCharges = bill.WaterCharges;
  defBill.ElectricityCharges = bill.ElectricityCharges;
  defBill.Miscellaneous = bill.Miscellaneous;
  defBill.HalfYearly = bill.HalfYearly;
  defBill.StartDate = bill.StartDate;
  defBill.EndDate = bill.EndDate;
  defBill.Total = bill.Total;
  await dbPaDetailBills.insert(defBill);
  await dbPaBills.removePaBill(resId, bill);
  return det._id;
};

const createDetail = async args => {
  const det = await getDetail(args);
  const bill = await dbPaBills.getBillForResident(args.resId, args.billId);
  const id = await insert(det, bill, args.resId);
  return id;
};

const detailMultipleBills = async (args, paBills) => {
  const res = await dbResidents.getById(args.resId);
  const nArgs = Object.assign({}, args);
  const det = await dbPaDetails.getDefault();
  const detArray = [];
  const defBillArray = [];
  for (const bill of paBills) {
    nArgs.billType = bill.Type;
    nArgs.billId = bill._id;
    const nDet = await getDetail(nArgs);
    detArray.push(nDet);
    const defBill = await dbPaDetailBills.getDefault();
    defBill.DetailId = det._id;
    defBill.ResidentId = nArgs.resId;
    defBill.BillPeriod = bill.BillPeriod;
    defBill.Type = bill.Type;
    defBill.Security = bill.Security;
    defBill.RoomRent = bill.RoomRent;
    defBill.WaterCharges = bill.WaterCharges;
    defBill.ElectricityCharges = bill.ElectricityCharges;
    defBill.Miscellaneous = bill.Miscellaneous;
    defBill.HalfYearly = bill.HalfYearly;
    defBill.StartDate = bill.StartDate;
    defBill.EndDate = bill.EndDate;
    defBill.Total = bill.Total;
    defBillArray.push(defBill);
  }
  let element = {};
  for (const detail of detArray) {
    element = detail;
    det.Security += element.Security;
    det.RoomRent += element.RoomRent;
    det.WaterCharges += element.WaterCharges;
    det.ElectricityCharges += element.ElectricityCharges;
    det.Miscellaneous += element.Miscellaneous;
    det.DevelopmentFund += element.DevelopmentFund;
    det.CelebrationFund += element.CelebrationFund;
    det.RutineHstlMaintnceCharges += element.RutineHstlMaintnceCharges;
    det.Total +=
      element.Security +
      element.RoomRent +
      element.WaterCharges +
      element.ElectricityCharges +
      element.Miscellaneous +
      element.DevelopmentFund +
      element.CelebrationFund +
      element.RutineHstlMaintnceCharges;
  }
  const ef = await Dates.effectiveDate();
  const rNum = await PaDetailsGet.nextReceiptNumber();
  det.ReceiptDate = ef.EffectiveDate;
  det.DepositDate = ef.EffectiveDate;
  det.ResidentId = args.resId;
  det.ReceiptNumber = rNum;
  det.Name = res.Name;
  det.RoomNumber = res.Room.Value;
  det.RollNumber = res.RollNumber;
  det.Focus = true;
  for (const bill of defBillArray) {
    await dbPaDetailBills.insert(bill);
  }
  for (const bill of paBills) {
    await dbPaBills.removePaBill(args.resId, bill);
  }
  await dbPaDetails.insert(det);
  return det._id;
};

const createDetailAllBills = async args => {
  const paBills = await dbPaBills.getAll(args.resId);
  const id = await detailMultipleBills(args, paBills);
  return id;
};

const txnDetailPa = async args => {
  const bills = await dbTxnPaBills.getAll(args.resId);
  const id = await detailMultipleBills(args, bills);
  await dbTxnPaBills.removeAll(args.resId);
  return id;
};

const PaDetailBills = {
  txnDetailPa,
  createDetailAllBills,
  createDetail
};

export default PaDetailBills;
