import Accounts from "../../../data/accounts/accounts";
import dbFinesPa from "../../../db/dbFinesPa";
import dbMonthsPa from "../../../db/dbMonthsPa";
import dbPaBills from "../../../db/dbPaBills";
import dbResidents from "../../../db/dbResidents";
import moment from "moment";
import updateFinesPa from "../../../data/finesPa/finesPa";

const addPaDailyBill = async id => {
  const startdate = moment
    .utc()
    .utcOffset(+5.5)
    .toDate();
  const enddate = moment
    .utc()
    .utcOffset(+5.5)
    .toDate();

  const SrNo = await dbPaBills.nextSrNo(id);
  const paBill = {
    BillPeriod: "None",
    RoomRent: 0,
    WaterCharges: 0,
    ElectricityCharges: 0,
    HalfYearly: 0,
    Miscellaneous: 0,
    Security: 0,
    StartDate: startdate,
    EndDate: enddate,
    SrNo,
    Total: 0,
    IsPaid: false,
    Type: "Daily"
  };
  const billId = await dbPaBills.insertPaBill(id, paBill);
  return billId;
};

const addPaRegularBill = async id => {
  await updateFinesPa();
  const SrNo = await dbPaBills.nextSrNo(id);
  const paBill = {
    BillPeriod: "",
    RoomRent: 0,
    WaterCharges: 0,
    ElectricityCharges: 0,
    Security: 0,
    Miscellaneous: 0,
    HalfYearly: 0,
    SrNo,
    Total: 0,
    IsPaid: false,
    Type: "Regular"
  };
  const resi = await dbResidents.getById(id);
  const paMonth = await dbMonthsPa.getSelectedTrue();
  const paFine = await dbFinesPa.getByMonth(paMonth.Value);
  paBill.Miscellaneous = paFine.Pa;
  paBill.BillPeriod = paMonth.Value;
  let roomrent = paMonth.RoomRent;
  paBill.WaterCharges = paMonth.WaterCharges;
  paBill.ElectricityCharges = paMonth.ElectricityCharges;
  paBill.HalfYearly = paMonth.HalfYearly;
  if (
    resi.Category.Value.includes("SC") ||
    resi.Category.Value.includes("ST")
  ) {
    roomrent = 0;
  }
  paBill.RoomRent = roomrent;
  paBill.Total =
    roomrent +
    paMonth.WaterCharges +
    paMonth.ElectricityCharges +
    paFine.Pa +
    paMonth.HalfYearly;
  const billId = await dbPaBills.insertPaBill(id, paBill);
  await Accounts.processAccount(id);
  return billId;
};

const addPaBill = async args => {
  let id = "";
  if (args.billType === "daily") {
    id = await addPaDailyBill(args.id);
  }
  if (args.billType === "regular") {
    id = await addPaRegularBill(args.id);
  }
  return id;
};

export default addPaBill;
