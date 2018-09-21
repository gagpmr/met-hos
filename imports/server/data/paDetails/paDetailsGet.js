import { _ } from "underscore";
import dbPaDetails from "../../db/dbPaDetails";
import moment from "moment";

const nextReceiptNumber = async () => {
  const lastDetail = await dbPaDetails.lastDetail();
  return lastDetail.ReceiptNumber + 1;
};

const editPaDetail = async args => {
  const detail = await dbPaDetails.getById(args.detId);
  return detail;
};

const dateDetails = async args => {
  const targetDate = moment.utc(args.date, "DD-MM-YYYY").toDate();
  const details = await dbPaDetails.getForDepositDate(targetDate);
  const dayCollection = {
    RoomRent: 0,
    WaterCharges: 0,
    ElectricityCharges: 0,
    Miscellaneous: 0,
    DevelopmentFund: 0,
    RutineHstlMaintnceCharges: 0,
    Total: 0
  };
  _.each(details, element => {
    dayCollection.RoomRent += element.RoomRent;
    dayCollection.WaterCharges += element.WaterCharges;
    dayCollection.ElectricityCharges += element.ElectricityCharges;
    dayCollection.Miscellaneous += element.Miscellaneous;
    dayCollection.DevelopmentFund += element.DevelopmentFund;
    dayCollection.RutineHstlMaintnceCharges +=
      element.RutineHstlMaintnceCharges;
    dayCollection.Total += element.Total;
  });
  return {
    details,
    dayCollection
  };
};

const getByResId = async args => {
  return dbPaDetails.getByResId(args.resId);
};

const PaDetailsGet = {
  getByResId,
  dateDetails,
  editPaDetail,
  nextReceiptNumber
};

export default PaDetailsGet;
