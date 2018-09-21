import McDayTotals from "../mcDayTotals/mcDayTotals";
import McDetailsGet from "./mcDetailsGet";
import dbMcDetails from "../../db/dbMcDetails";
import moment from "moment";

const updateDetail = async args => {
  const detail = await dbMcDetails.getById(args.detId);
  const oldDate = detail.DepositDate;
  detail.ReceiptDate = moment.utc(args.receiptDate, "DD-MM-YYYY").toDate();
  detail.DepositDate = moment.utc(args.depositDate, "DD-MM-YYYY").toDate();
  detail.ReceiptNumber = parseInt(args.receiptNumber, 10);
  detail.StudentName = args.studentName;
  detail.RoomNumber = args.roomNumber;
  detail.RollNumber = args.rollNumber;
  detail.MonthName = args.monthName;
  detail.MessOne = parseInt(args.messOne, 10);
  detail.MessTwo = parseInt(args.messTwo, 10);
  detail.Canteen = parseInt(args.canteen, 10);
  detail.Fines = parseInt(args.fines, 10);
  detail.Amenity = parseInt(args.amenity, 10);
  detail.PoorStuWelFund = parseInt(args.poorStuWelFund, 10);
  detail.McServantWelFund = parseInt(args.mcServantWelFund, 10);
  detail.FoodSubsidy = parseInt(args.foodSubsidy, 10);
  detail.CelebrationFund = parseInt(args.celebrationFund, 10);
  detail.Total =
    detail.MessOne +
    detail.MessTwo +
    detail.Canteen +
    detail.Fines +
    detail.Amenity +
    detail.PoorStuWelFund +
    detail.McServantWelFund +
    detail.FoodSubsidy +
    detail.CelebrationFund;
  await dbMcDetails.updateDetail(detail);
  await McDayTotals.upsert(detail.DepositDate);
  await McDayTotals.upsert(oldDate);
  return "Mc Detail Updated";
};

const removeDetail = async args => {
  const detail = await dbMcDetails.getById(args.detId);
  const date = detail.DepositDate;
  await dbMcDetails.removeById(args.detId);
  await McDayTotals.upsert(date);
  return "Mc Detail Removed";
};

const cancelledMcDetail = async args => {
  const rNum = parseInt(args.rNum, 10) + 1;
  const rDate = moment.utc(args.date, "DD-MM-YYYY").toDate();
  await dbMcDetails.focusFalseForDate(rDate);
  await dbMcDetails.insertCancelled(rNum, rDate);
  await McDayTotals.upsert(rDate);
  return "Cancelled Mc Detail Inserted";
};

const copyEditMcDetail = async args => {
  const detail = await dbMcDetails.getById(args.detId);
  const item = await dbMcDetails.getDefault();
  const rNum = await McDetailsGet.nextReceiptNumber(detail.DepositDate);
  item.ReceiptDate = detail.ReceiptDate;
  item.DepositDate = detail.DepositDate;
  item.ResidentId = detail.ResidentId;
  item.ReceiptNumber = rNum;
  item.StudentName = detail.StudentName;
  item.RoomNumber = detail.RoomNumber;
  item.RollNumber = detail.RollNumber;
  await dbMcDetails.insert(item);
  return item._id;
};

const McDetailsPost = {
  copyEditMcDetail,
  cancelledMcDetail,
  removeDetail,
  updateDetail
};

export default McDetailsPost;
