import Dates from "../../data/dates/dates";
import McDetailsGet from "../mcDetails/mcDetailsGet";
import { _ } from "meteor/underscore";
import dbMcBills from "../../db/dbMcBills";
import dbMcDetailBills from "../../db/dbMcDetailBills";
import dbMcDetails from "../../db/dbMcDetails";
import dbResidents from "../../db/dbResidents";
import dbSessions from "../../db/dbSessions";
import dbTxnMcBills from "../../db/dbTxnMcBills";

const fromFullBill = async args => {
  const det = await dbMcDetails.getDefault();
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  det.MessOne = bill.MessOne;
  det.MessTwo = bill.MessTwo;
  det.Canteen = bill.Canteen;
  det.Amenity = bill.Amenity;
  det.Fines = bill.MessFine + bill.CanteenFine;
  return det;
};

const fromMessOneBill = async args => {
  const det = await dbMcDetails.getDefault();
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  det.MessOne = bill.MessOne;
  det.Fines = bill.MessFine;
  return det;
};

const fromMessTwoBill = async args => {
  const det = await dbMcDetails.getDefault();
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  det.MessTwo = bill.MessTwo;
  det.Fines = bill.MessFine;
  return det;
};

const fromCanteenBill = async args => {
  const det = await dbMcDetails.getDefault();
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  det.Canteen = bill.Canteen;
  det.Fines = bill.CanteenFine;
  return det;
};

const fromHalfYearly = async args => {
  const det = await dbMcDetails.getDefault();
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  det.Fines = bill.HalfYearlyFine;
  const sess = await dbSessions.getCurrentSession();
  const hySixMonths =
    sess.PoorStuWelFund +
    sess.McServantWelFund +
    sess.FoodSubsidy +
    sess.CelebrationFund;
  const hyThreeMonths = hySixMonths / 2;
  if (bill.HalfYearly === hySixMonths) {
    det.PoorStuWelFund = sess.PoorStuWelFund;
    det.McServantWelFund = sess.McServantWelFund;
    det.FoodSubsidy = sess.FoodSubsidy;
    det.CelebrationFund = sess.CelebrationFund;
  } else if (bill.HalfYearly === hyThreeMonths) {
    det.PoorStuWelFund = sess.PoorStuWelFund / 2;
    det.McServantWelFund = sess.McServantWelFund / 2;
    det.FoodSubsidy = sess.FoodSubsidy / 2;
    det.CelebrationFund = sess.CelebrationFund / 2;
  }
  return det;
};

const getDetail = async args => {
  let det = {};
  switch (args.billType) {
    case "FullBill":
      det = await fromFullBill(args);
      break;
    case "MessOne":
      det = await fromMessOneBill(args);
      break;
    case "MessTwo":
      det = await fromMessTwoBill(args);
      break;
    case "Canteen":
      det = await fromCanteenBill(args);
      break;
    case "HalfYearly":
      det = await fromHalfYearly(args);
      break;
    case "Quarterly":
      det = await fromHalfYearly(args);
      break;
    default:
      console.log("Default: Get Mc Detail");
  }
  return det;
};

const insert = async (detail, bill, resId) => {
  const ef = await Dates.effectiveDate();
  const rNum = await McDetailsGet.nextReceiptNumber(ef.EffectiveDate);
  const res = await dbResidents.getById(resId);
  const det = Object.assign({}, detail);
  det.ReceiptDate = ef.EffectiveDate;
  det.DepositDate = ef.EffectiveDate;
  det.ResidentId = resId;
  det.ReceiptNumber = rNum;
  det.StudentName = res.Name;
  det.RoomNumber = res.Room.Value;
  det.RollNumber = res.RollNumber;
  det.MonthName = bill.BillPeriod;
  det.Focus = true;
  det.Total = bill.Total;
  await dbMcDetails.insert(det);
  const defBill = await dbMcDetailBills.getDefault();
  defBill.DetailId = det._id;
  defBill.ResidentId = resId;
  defBill.BillPeriod = bill.BillPeriod;
  defBill.Type = bill.Type;
  defBill.MessOne = bill.MessOne;
  defBill.MessTwo = bill.MessTwo;
  defBill.Canteen = bill.Canteen;
  defBill.MessFine = bill.MessFine;
  defBill.CanteenFine = bill.CanteenFine;
  defBill.Amenity = bill.Amenity;
  defBill.HalfYearly = bill.HalfYearly;
  defBill.HalfYearlyFine = bill.HalfYearlyFine;
  defBill.Total = bill.Total;
  await dbMcDetailBills.insert(defBill);
  await dbMcBills.removeMcBill(resId, bill);
  return det._id;
};

const createDetail = async args => {
  const det = await getDetail(args);
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  const id = await insert(det, bill, args.resId);
  return id;
};

const detailMultipleBills = async (args, mcBills) => {
  const res = await dbResidents.getById(args.resId);
  const nArgs = Object.assign({}, args);
  const det = await dbMcDetails.getDefault();
  const detArray = [];
  const defBillArray = [];
  let element = {};
  for (const bill of mcBills) {
    nArgs.billType = bill.Type;
    nArgs.billId = bill._id;
    const nDet = await getDetail(nArgs);
    detArray.push(nDet);
    const defBill = await dbMcDetailBills.getDefault();
    defBill.DetailId = det._id;
    defBill.ResidentId = nArgs.resId;
    defBill.BillPeriod = bill.BillPeriod;
    defBill.Type = bill.Type;
    defBill.MessOne = bill.MessOne;
    defBill.MessTwo = bill.MessTwo;
    defBill.Canteen = bill.Canteen;
    defBill.MessFine = bill.MessFine;
    defBill.CanteenFine = bill.CanteenFine;
    defBill.Amenity = bill.Amenity;
    defBill.HalfYearly = bill.HalfYearly;
    defBill.HalfYearlyFine = bill.HalfYearlyFine;
    defBill.Total = bill.Total;
    defBillArray.push(defBill);
  }
  for (const arrayDetail of detArray) {
    element = arrayDetail;
    det.MessOne += element.MessOne;
    det.MessTwo += element.MessTwo;
    det.Canteen += element.Canteen;
    det.Amenity += element.Amenity;
    det.Fines += element.Fines;
    det.PoorStuWelFund += element.PoorStuWelFund;
    det.McServantWelFund += element.McServantWelFund;
    det.FoodSubsidy += element.FoodSubsidy;
    det.CelebrationFund += element.CelebrationFund;
    det.Total +=
      element.MessOne +
      element.MessTwo +
      element.Canteen +
      element.Amenity +
      element.Fines +
      element.PoorStuWelFund +
      element.McServantWelFund +
      element.CelebrationFund +
      element.FoodSubsidy;
  }
  const ef = await Dates.effectiveDate();
  const rNum = await McDetailsGet.nextReceiptNumber(ef.EffectiveDate);
  det.ReceiptDate = ef.EffectiveDate;
  det.DepositDate = ef.EffectiveDate;
  det.ResidentId = nArgs.resId;
  det.ReceiptNumber = rNum;
  det.StudentName = res.Name;
  det.RoomNumber = res.Room.Value;
  det.RollNumber = res.RollNumber;
  det.Focus = true;
  const last = _.last(defBillArray);
  if (last !== undefined) {
    det.MonthName = last.BillPeriod;
  }
  for (const bill of defBillArray) {
    await dbMcDetailBills.insert(bill);
  }
  for (const bill of mcBills) {
    await dbMcBills.removeMcBill(nArgs.resId, bill);
  }
  await dbMcDetails.insert(det);
  return det._id;
};

const createDetailAllBills = async args => {
  const mcBills = await dbMcBills.getAll(args.resId);
  const id = await detailMultipleBills(args, mcBills);
  return id;
};

const txnDetailMc = async args => {
  const mcBills = await dbTxnMcBills.getAll(args.resId);
  const id = await detailMultipleBills(args, mcBills);
  await dbTxnMcBills.removeAll(args.resId);
  return id;
};

const McDetailBills = {
  txnDetailMc,
  createDetailAllBills,
  createDetail
};

export default McDetailBills;
