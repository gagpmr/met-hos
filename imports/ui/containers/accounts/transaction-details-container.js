import { McDetails } from "/imports/api/mcdetails/mcdetails.js";
import { Meteor } from "meteor/meteor";
import { PaDetails } from "/imports/api/padetails/padetails.js";
import TransactionDetails from "/imports/ui/components/resident-details/accounts/transaction/transaction-details.js";
import { createContainer } from "meteor/react-meteor-data";
import moment from "moment";

export default createContainer(({ match, history }) => {
  const { paDetId, mcDetId } = match.params;
  const subscription = Meteor.subscribe("mc-detail-by-id", mcDetId);
  const subsone = Meteor.subscribe("pa-detail-by-id", paDetId);
  const loading = !subscription.ready() || !subsone.ready();
  const padetail = PaDetails.findOne({});
  const mcdetail = McDetails.findOne({});

  if (mcdetail) {
    mcdetail.ShowExtraRows = true;
    const rcptDate = moment.utc(mcdetail.ReceiptDate).format("DD-MM-YYYY");
    const deptDate = moment.utc(mcdetail.DepositDate).format("DD-MM-YYYY");
    mcdetail.ReceiptDate = rcptDate;
    mcdetail.DepositDate = deptDate;
    if (mcdetail.MessOne === 0) {
      mcdetail.ShowMessOne = false;
    } else {
      mcdetail.ShowMessOne = true;
    }
    if (mcdetail.MessTwo === 0) {
      mcdetail.ShowMessTwo = false;
    } else {
      mcdetail.ShowMessTwo = true;
    }
    if (mcdetail.Canteen === 0) {
      mcdetail.ShowCanteen = false;
    } else {
      mcdetail.ShowCanteen = true;
    }
    if (mcdetail.Fines === 0) {
      mcdetail.ShowFines = false;
    } else {
      mcdetail.ShowFines = true;
    }
    if (mcdetail.Amenity === 0) {
      mcdetail.ShowAmenity = false;
    } else {
      mcdetail.ShowAmenity = true;
    }
    if (mcdetail.PoorStuWelFund === 0) {
      mcdetail.ShowPoorStuWelFund = false;
    } else {
      mcdetail.ShowPoorStuWelFund = true;
    }
    if (mcdetail.McServantWelFund === 0) {
      mcdetail.ShowMcServantWelFund = false;
    } else {
      mcdetail.ShowMcServantWelFund = true;
    }
    if (mcdetail.FoodSubsidy === 0) {
      mcdetail.ShowFoodSubsidy = false;
    } else {
      mcdetail.ShowFoodSubsidy = true;
    }
    if (mcdetail.ResidentId === undefined) {
      mcdetail.ShowResidentDetails = false;
    } else {
      mcdetail.ShowResidentDetails = true;
    }
  }
  if (padetail) {
    padetail.ShowExtraRows = true;
    const rcptDate = moment.utc(padetail.ReceiptDate).format("DD-MM-YYYY");
    const deptDate = moment.utc(padetail.DepositDate).format("DD-MM-YYYY");
    padetail.ReceiptDate = rcptDate;
    padetail.DepositDate = deptDate;
    if (padetail.Security === 0) {
      padetail.ShowSecurity = false;
    } else {
      padetail.ShowSecurity = true;
    }
    if (padetail.RoomRent === 0) {
      padetail.ShowRoomRent = false;
    } else {
      padetail.ShowRoomRent = true;
    }
    if (padetail.WaterCharges === 0) {
      padetail.ShowWaterCharges = false;
    } else {
      padetail.ShowWaterCharges = true;
    }
    if (padetail.ElectricityCharges === 0) {
      padetail.ShowElectricityCharges = false;
    } else {
      padetail.ShowElectricityCharges = true;
    }
    if (padetail.CelebrationFund === 0) {
      padetail.ShowCelebrationFund = false;
    } else {
      padetail.ShowCelebrationFund = true;
    }
    if (padetail.DevelopmentFund === 0) {
      padetail.ShowDevelopmentFund = false;
    } else {
      padetail.ShowDevelopmentFund = true;
    }
    if (padetail.RutineHstlMaintnceCharges === 0) {
      padetail.ShowRutineHstlMaintnceCharges = false;
    } else {
      padetail.ShowRutineHstlMaintnceCharges = true;
    }
    if (padetail.Miscellaneous === 0) {
      padetail.ShowMiscellaneous = false;
    } else {
      padetail.ShowMiscellaneous = true;
    }
    if (padetail.ResidentId === undefined) {
      padetail.ShowResidentDetails = false;
    } else {
      padetail.ShowResidentDetails = true;
    }
  }
  return { loading, padetail, mcdetail, history };
}, TransactionDetails);
