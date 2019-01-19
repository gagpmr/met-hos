import { _ } from "underscore";
import dbSaDetails from "../../db/dbSaDetails";
import moment from "moment";

const nextReceiptNumber = async () => {
  const lastDetail = await dbSaDetails.lastDetail();
  if (lastDetail) {
    return parseInt(lastDetail.ReceiptNumber, 10) + 1;
  }
  return 1;
};

const editSaDetail = async args => {
  const detail = await dbSaDetails.getById(args.detId);
  return detail;
};

const dateDetails = async args => {
  const targetDate = moment.utc(args.date, "DD-MM-YYYY").toDate();
  const details = await dbSaDetails.getForDepositDate(targetDate);
  const dayCollection = {
    HostelSecurity: 0,
    MessSecurity: 0,
    CanteenSecurity: 0,
    Total: 0
  };
  _.each(details, element => {
    dayCollection.HostelSecurity += element.HostelSecurity;
    dayCollection.MessSecurity += element.MessSecurity;
    dayCollection.CanteenSecurity += element.CanteenSecurity;
    dayCollection.Total += element.Total;
  });
  return {
    details,
    dayCollection
  };
};

const getByResId = async args => {
  return dbSaDetails.getByResId(args.resId);
};

const SaDetailsGet = {
  getByResId,
  dateDetails,
  editSaDetail,
  nextReceiptNumber
};

export default SaDetailsGet;
