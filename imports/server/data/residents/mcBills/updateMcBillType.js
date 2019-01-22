import Dates from "../../dates/dates";
import dbMcBills from "../../../db/dbMcBills";
import dbSessions from "../../../db/dbSessions";
import moment from "moment";

const setValues = async bill => {
  const nBill = Object.assign({}, bill);
  nBill.BillPeriod = bill.BillPeriod;
  const sess = await dbSessions.getCurrentSession();
  const ef = await Dates.effectiveDate();
  if (nBill.Type === "HalfYearly" || nBill.Type === "Quarterly") {
    const year = moment.utc(ef.EffectiveDate).format("YYYY");
    const hy =
      sess.PoorStuWelFund +
      sess.McServantWelFund +
      sess.FoodSubsidy +
      sess.CelebrationFund;
    const month = `HYr, ${year}`;
    nBill.BillPeriod = month;
    if (nBill.Type === "HalfYearly") {
      nBill.HalfYearly = hy;
      nBill.Total = hy;
    }
    if (nBill.Type === "Quarterly") {
      nBill.HalfYearly = hy / 2;
      nBill.Total = hy / 2;
      if (!sess.Value.includes(year)) {
        nBill.BillPeriod = `HYr/2, ${year}`;
      }
    }
  }
  return nBill;
};

const toNewBillType = async (args, billType) => {
  let bill = await dbMcBills.getBillForResident(args.id, args.billId);
  bill.Type = billType;
  bill = await setValues(bill);
  await dbMcBills.replaceMcBill(args.id, bill);
  return bill;
};

const updateMcBillType = async args => {
  let mcBill = {};
  switch (args.billType) {
    case "messOne":
      mcBill = await toNewBillType(args, "MessOne");
      break;
    case "messTwo":
      mcBill = await toNewBillType(args, "MessTwo");
      break;
    case "canteen":
      mcBill = await toNewBillType(args, "Canteen");
      break;
    case "halfYearly":
      mcBill = await toNewBillType(args, "HalfYearly");
      break;
    case "quarterly":
      mcBill = await toNewBillType(args, "Quarterly");
      break;
    default:
      console.log("Default: UpdateMcBillType");
  }
  return mcBill;
};

export default updateMcBillType;
