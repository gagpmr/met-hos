import Dates from "../dates/dates";
import SaDayTotals from "../saDayTotals/saDayTotals";
import SaDetailsGet from "./saDetailsGet";
import dbResidents from "../../db/dbResidents";
import dbSaDetails from "../../db/dbSaDetails";
import dbSessions from "../../db/dbSessions";
import moment from "moment";

const createSaDetail = async args => {
  const ef = await Dates.effectiveDate();
  const depositDate = ef.EffectiveDate;
  const rnum = await SaDetailsGet.nextReceiptNumber();
  const detail = await dbSaDetails.defaultSaDetail();
  const resi = await dbResidents.getById(args.resId);
  const sess = await dbSessions.getCurrentSession();
  detail.DepositDate = depositDate;
  detail.ReceiptDate = depositDate;
  detail.ReceiptNumber = rnum;
  detail.ResidentId = args.resId;
  detail.StudentName = resi.Name;
  detail.RoomNumber = resi.Room.Value;
  detail.RollNumber = resi.RollNumber;
  detail.HostelSecurity = sess.HostelSecurity;
  detail.MessSecurity = sess.MessSecurity;
  detail.CanteenSecurity = sess.CanteenSecurity;
  const id = await dbSaDetails.insertDetail(detail);
  return id;
};

const updateSaDetail = async args => {
  const detail = await dbSaDetails.getById(args.detId);
  detail.ReceiptDate = moment.utc(args.receiptDate, "DD-MM-YYYY").toDate();
  detail.DepositDate = moment.utc(args.depositDate, "DD-MM-YYYY").toDate();
  detail.ReceiptNumber = args.receiptNumber;
  detail.StudentName = args.studentName;
  detail.RoomNumber = args.roomNumber;
  detail.RollNumber = args.rollNumber;
  detail.HostelSecurity = parseInt(args.hostelSecurity, 10);
  detail.MessSecurity = parseInt(args.messSecurity, 10);
  detail.CanteenSecurity = parseInt(args.canteenSecurity, 10);
  detail.Total =
    detail.HostelSecurity + detail.MessSecurity + detail.CanteenSecurity;
  await dbSaDetails.updateSaDetail(detail);
  await SaDayTotals.upsert(detail.DepositDate);
  return "Sa Detail Updated";
};

const removeDetail = async args => {
  const detail = await dbSaDetails.getById(args.detId);
  await dbSaDetails.removeById(args.detId);
  await SaDayTotals.upsert(detail.DepositDate);
  return "Sa Detail Removed";
};

const cancelledSaDetail = async args => {
  const rNum = parseInt(args.rNum, 10) + 1;
  const rDate = moment.utc(args.date, "DD-MM-YYYY").toDate();
  await dbSaDetails.focusFalseForDate(rDate);
  await dbSaDetails.insertCancelled(rNum, rDate);
  await SaDayTotals.upsert(rDate);
  return "Cancelled Sa Detail Inserted";
};

const SaDetailsPost = {
  cancelledSaDetail,
  removeDetail,
  createSaDetail,
  updateSaDetail
};

export default SaDetailsPost;
