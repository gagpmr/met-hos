import { _ } from "underscore";
import dbMcDetails from "../../db/dbMcDetails";
import moment from "moment";

const nextReceiptNumber = async depositDate => {
  const lastDetail = await dbMcDetails.lastDetail(depositDate);
  return parseInt(lastDetail.ReceiptNumber, 10) + 1;
};

const editMcDetail = async args => {
  const detail = await dbMcDetails.getById(args.detId);
  return detail;
};

const dateDetails = async args => {
  const targetDate = moment.utc(args.date, "DD-MM-YYYY").toDate();
  const details = await dbMcDetails.getForDepositDate(targetDate);
  const dayCollection = {
    MessOne: 0,
    MessTwo: 0,
    Canteen: 0,
    Fines: 0,
    Amenity: 0,
    Total: 0,
    PoorStuWelFund: 0,
    McServantWelFund: 0,
    FoodSubsidy: 0,
    CelebrationFund: 0
  };
  _.each(details, element => {
    dayCollection.MessOne += element.MessOne;
    dayCollection.MessTwo += element.MessTwo;
    dayCollection.Canteen += element.Canteen;
    dayCollection.Fines += element.Fines;
    dayCollection.Amenity += element.Amenity;
    dayCollection.Total += element.Total;
    dayCollection.PoorStuWelFund += element.PoorStuWelFund;
    dayCollection.McServantWelFund += element.McServantWelFund;
    dayCollection.FoodSubsidy += element.FoodSubsidy;
    dayCollection.CelebrationFund += element.CelebrationFund;
  });
  return {
    details,
    dayCollection
  };
};

const getByResId = async args => {
  return dbMcDetails.getByResId(args.resId);
};

const McDetailsGet = {
  getByResId,
  dateDetails,
  editMcDetail,
  nextReceiptNumber
};

export default McDetailsGet;
