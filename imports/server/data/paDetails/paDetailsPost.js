import PaDayTotals from "../paDayTotals/paDayTotals";
import PaDetailsGet from "./paDetailsGet";
import dbPaDetails from "../../db/dbPaDetails";
import moment from "moment";

const removeDetail = async args => {
  const detail = await dbPaDetails.getById(args.detId);
  const depositDate = detail.DepositDate;
  await dbPaDetails.removeById(args.detId);
  await PaDayTotals.upsert(depositDate);
  return "Pa Detail Removed";
};

const cancelledPaDetail = async args => {
  const rDate = moment.utc(args.date, "DD-MM-YYYY").toDate();
  await dbPaDetails.focusFalseForDate(rDate);
  const rNum = await PaDetailsGet.nextReceiptNumber();
  await dbPaDetails.insertCancelled(rNum, rDate);
  await PaDayTotals.upsert(rDate);
  return "Cancelled Pa Detail Inserted";
};

const copyEditPaDetail = async args => {
  const detail = await dbPaDetails.getById(args.detId);
  const item = await dbPaDetails.getDefault();
  const rNum = await PaDetailsGet.nextReceiptNumber();
  item.ReceiptDate = detail.ReceiptDate;
  item.DepositDate = detail.DepositDate;
  item.ResidentId = detail.ResidentId;
  item.ReceiptNumber = rNum;
  item.Name = detail.Name;
  item.RoomNumber = detail.RoomNumber;
  item.RollNumber = detail.RollNumber;
  await dbPaDetails.insert(item);
  return item._id;
};

const updateDetail = async args => {
  const detail = await dbPaDetails.getById(args.detId);
  detail.ReceiptDate = moment.utc(args.receiptDate, "DD-MM-YYYY").toDate();
  detail.DepositDate = moment.utc(args.depositDate, "DD-MM-YYYY").toDate();
  detail.ReceiptNumber = args.receiptNumber;
  detail.Name = args.name;
  detail.RoomNumber = args.roomNumber;
  detail.RollNumber = args.rollNumber;
  detail.RoomRent = parseInt(args.roomRent, 10);
  detail.WaterCharges = parseInt(args.waterCharges, 10);
  detail.ElectricityCharges = parseInt(args.electricityCharges, 10);
  detail.DevelopmentFund = parseInt(args.developmentFund, 10);
  detail.RutineHstlMaintnceCharges = parseInt(
    args.rutineHstlMaintnceCharges,
    10
  );
  detail.Miscellaneous = parseInt(args.miscellaneous, 10);
  detail.Total =
    detail.RoomRent +
    detail.WaterCharges +
    detail.ElectricityCharges +
    detail.DevelopmentFund +
    detail.RutineHstlMaintnceCharges +
    detail.Miscellaneous;
  detail.Focus = true;
  await dbPaDetails.updateDetail(detail);
  await PaDayTotals.upsert(detail.DepositDate);
  return "Pa Detail Updated";
};

const PaDetailsPost = {
  copyEditPaDetail,
  cancelledPaDetail,
  removeDetail,
  updateDetail
};

export default PaDetailsPost;
