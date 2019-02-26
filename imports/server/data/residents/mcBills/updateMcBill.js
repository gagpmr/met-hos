import Accounts from "../../accounts/accounts";
import dbFinesMc from "../../../db/dbFinesMc";
import dbMcBills from "../../../db/dbMcBills";
import dbSessions from "../../../db/dbSessions";
import updateFinesMc from "../../finesMc/finesMc";

const setDefaultValues = async () => {
  const nBill = {};
  nBill.MessOne = 0;
  nBill.MessTwo = 0;
  nBill.Canteen = 0;
  nBill.MessFine = 0;
  nBill.CanteenFine = 0;
  nBill.Amenity = 0;
  nBill.HalfYearly = 0;
  nBill.HalfYearlyFine = 0;
  nBill.Total = 0;
  nBill.BillPeriod = "";
  nBill.IsPaid = false;
  nBill.HasMessFine = true;
  nBill.HasCanteenFine = true;
  nBill.Type = "";
  return nBill;
};

const updateMcFullBill = async args => {
  await updateFinesMc();
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  const dBill = await setDefaultValues();
  dBill.SrNo = bill.SrNo;
  if (args.billPeriod.includes("HYr")) {
    const fine = await dbFinesMc.getByMonth(args.billPeriod);
    dBill.BillPeriod = args.billPeriod;
    dBill.Type = "HalfYearly";
    const sess = await dbSessions.getCurrentSession();
    let hy =
      sess.PoorStuWelFund +
      sess.McServantWelFund +
      sess.FoodSubsidy +
      sess.CelebrationFund;
    if (args.billPeriod.includes("/2")) {
      hy /= 2;
      dBill.Type = "Quarterly";
    }
    dBill.HalfYearly = hy;
    dBill.HalfYearlyFine = fine.Mc;
    dBill._id = bill._id;
    const nBill = await dbMcBills.replaceMcBill(args.resId, dBill);
    await Accounts.processAccount(args.resId);
    return nBill;
  }
  let messOne = parseInt(args.messOne, 10);
  let messTwo = parseInt(args.messTwo, 10);
  let canteen = parseInt(args.canteen, 10);
  let amenity = parseInt(args.amenity, 10);
  if (isNaN(messOne)) {
    messOne = 0;
  }
  if (isNaN(messTwo)) {
    messTwo = 0;
  }
  if (isNaN(messTwo)) {
    canteen = 0;
  }
  if (isNaN(amenity)) {
    amenity = 0;
  }
  const total = messOne + messTwo + canteen + amenity;
  dBill._id = bill._id;
  dBill.MessOne = messOne;
  dBill.MessTwo = messTwo;
  dBill.Canteen = canteen;
  dBill.Amenity = amenity;
  dBill.Total = total;
  dBill.BillPeriod = args.billPeriod;
  dBill.IsPaid = args.isPaid;
  dBill.HasMessFine = args.hasMessFine;
  dBill.HasCanteenFine = args.hasCanteenFine;
  dBill.Type = "FullBill";
  const nBill = await dbMcBills.replaceMcBill(args.resId, dBill);
  await Accounts.processAccount(args.resId);
  await dbMcBills.nextSrNo(args.resId);
  return nBill;
};

const updateMcCanteenBill = async args => {
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  const canteen = parseInt(args.canteen, 10);
  if (canteen !== 0 && !isNaN(canteen)) {
    bill.Canteen -= canteen;
    bill.Total -= canteen;
    bill.Type = "FullBill";
    await dbMcBills.replaceMcBill(args.resId, bill);
    const dBill = await setDefaultValues();
    dBill.Canteen = canteen;
    dBill.Total = canteen;
    dBill.BillPeriod = bill.BillPeriod;
    dBill.HasCanteenFine = args.hasCanteenFine;
    dBill.Type = "FullBill";
    await dbMcBills.insertMcBill(args.resId, dBill);
    await dbMcBills.nextSrNo(args.resId);
  }
  await Accounts.processAccount(args.resId);
  return bill;
};

const updateMcMessOneBill = async args => {
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  const messOne = parseInt(args.messOne, 10);
  if (messOne !== 0 && !isNaN(messOne)) {
    bill.MessOne -= messOne;
    bill.Total -= messOne;
    bill.Type = "FullBill";
    await dbMcBills.replaceMcBill(args.resId, bill);
    const dBill = await setDefaultValues();
    dBill.MessOne = messOne;
    dBill.Total = messOne;
    dBill.BillPeriod = bill.BillPeriod;
    dBill.HasMessFine = args.hasMessFine;
    dBill.Type = "FullBill";
    await dbMcBills.insertMcBill(args.resId, dBill);
    await dbMcBills.nextSrNo(args.resId);
  }
  await Accounts.processAccount(args.resId);
  return bill;
};

const updateMcMessTwoBill = async args => {
  const bill = await dbMcBills.getBillForResident(args.resId, args.billId);
  const messTwo = parseInt(args.messTwo, 10);
  if (messTwo !== 0 && !isNaN(messTwo)) {
    bill.MessTwo -= messTwo;
    bill.Total -= messTwo;
    bill.Type = "FullBill";
    await dbMcBills.replaceMcBill(args.resId, bill);
    const dBill = await setDefaultValues();
    dBill.MessTwo = messTwo;
    dBill.Total = messTwo;
    dBill.BillPeriod = bill.BillPeriod;
    dBill.HasMessFine = args.hasMessFine;
    dBill.Type = "FullBill";
    await dbMcBills.insertMcBill(args.resId, dBill);
    await dbMcBills.nextSrNo(args.resId);
  }
  await Accounts.processAccount(args.resId);
  return bill;
};

const updateMcBill = async args => {
  let mcBill = {};
  switch (args.billType) {
    case "fullBill":
      mcBill = await updateMcFullBill(args);
      break;
    case "canteen":
      mcBill = await updateMcCanteenBill(args);
      break;
    case "messOne":
      mcBill = await updateMcMessOneBill(args);
      break;
    case "messTwo":
      mcBill = await updateMcMessTwoBill(args);
      break;
    default:
      console.log("Default: UpdateMcBill");
  }
  return mcBill;
};

export default updateMcBill;
