import dbPaBills from "../../../db/dbPaBills";
import dbSessions from "../../../db/dbSessions";
import moment from "moment";

const setDefaultValues = async bill => {
  const nBill = Object.assign({}, bill);
  nBill.RoomRent = 0;
  nBill.WaterCharges = 0;
  nBill.ElectricityCharges = 0;
  nBill.HalfYearly = 0;
  nBill.Miscellaneous = 0;
  nBill.Total = 0;
  nBill.IsPaid = false;
  nBill.HasFine = true;
  nBill.Security = 0;
  if (nBill.Type === "Security") {
    const sess = await dbSessions.getCurrentSession();
    nBill.Security = sess.HostelSecurity;
    nBill.Total = sess.Total;
  }
  if (nBill.Type === "HalfYearly") {
    const sess = await dbSessions.getCurrentSession();
    const hy = sess.RutineHstlMaintnceCharges + sess.DevelopmentFund;
    nBill.HalfYearly = hy;
    nBill.Total = hy;
  }
  if (nBill.Type === "Quarterly") {
    const sess = await dbSessions.getCurrentSession();
    const hy = sess.RutineHstlMaintnceCharges + sess.DevelopmentFund;
    nBill.HalfYearly = hy / 2;
    nBill.Total = hy / 2;
  }
  nBill.StartDate = moment
    .utc()
    .utcOffset(+5.5)
    .toDate();
  nBill.EndDate = moment
    .utc()
    .utcOffset(+5.5)
    .toDate();
  return nBill;
};

const toNewBillType = async (args, billType, billPeriod) => {
  let bill = await dbPaBills.getBillForResident(args.id, args.billId);
  bill.Type = billType;
  bill = await setDefaultValues(bill);
  bill.BillPeriod = billPeriod;
  await dbPaBills.replacePaBill(args.id, bill);
  return bill;
};

const updatePaBillType = async args => {
  let paBill = {};
  switch (args.billType) {
    case "electricity":
      paBill = await toNewBillType(args, "Electricity", "Electricity");
      break;
    case "nightStay":
      paBill = await toNewBillType(args, "NightStay", "Night Stay");
      break;
    case "continuation":
      paBill = await toNewBillType(
        args,
        "Continuation",
        moment
          .utc()
          .utcOffset(+5.5)
          .format("DD-MM-YYYY")
      );
      break;
    case "daily":
      paBill = await toNewBillType(
        args,
        "Daily",
        moment
          .utc()
          .utcOffset(+5.5)
          .format("DD-MM-YYYY")
      );
      break;
    case "fineWarden":
      paBill = await toNewBillType(args, "FineWarden", "Fine Warden");
      break;
    case "phdHra":
      paBill = await toNewBillType(args, "PhdHra", "Phd Hra");
      break;
    case "security":
      paBill = await toNewBillType(args, "Security", "Security");
      break;
    case "halfYearly":
      paBill = await toNewBillType(args, "HalfYearly", "Half Yearly");
      break;
    case "quarterly":
      paBill = await toNewBillType(args, "Quarterly", "Quarterly");
      break;
    default:
      console.log("Default: UpdatePaBill");
  }
  return paBill;
};

export default updatePaBillType;
