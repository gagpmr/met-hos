import dbFinesMc from "../../db/dbFinesMc";
import dbMcBills from "../../db/dbMcBills";
import dbResidents from "../../db/dbResidents";
import updateFinesMc from "../../data/finesMc/finesMc";

const unpaidTotalBillPeriod = async billArray => {
  let name = "";
  billArray.sort((a, b) => a.SrNo - b.SrNo);
  if (billArray.length === 0) {
    name = `-`;
  } else if (billArray.length === 1) {
    const firstBill = billArray[0];
    name = firstBill.BillPeriod;
  } else if (billArray.length > 1) {
    const firstBill = billArray[0];
    const lastBill = billArray[billArray.length - 1];
    if (firstBill.BillPeriod) {
      const month = `${firstBill.BillPeriod.substring(0, 3)} - ${
        lastBill.BillPeriod
      }`;
      name = month;
    }
  }
  return name;
};

const updateUnpaidMcTotalBillPeriod = async resId => {
  const resident = await dbResidents.getById(resId);
  const array = resident.McBills;
  const name = await unpaidTotalBillPeriod(array);
  const unpaidMcTotal = resident.UnpaidMcTotal;
  unpaidMcTotal.BillPeriod = name;
  await dbResidents.replaceUnpaidMcTotal(resId, unpaidMcTotal);
};

const updateUnpaidMcTotal = async resId => {
  const unpaidMcTotal = {
    BillPeriod: "Unpaid Total",
    MessOne: 0,
    MessTwo: 0,
    Canteen: 0,
    MessFine: 0,
    CanteenFine: 0,
    HalfYearly: 0,
    HalfYearlyFine: 0,
    Amenity: 0,
    Total: 0
  };
  await dbResidents.replaceUnpaidMcTotal(resId, unpaidMcTotal);
  const resident = await dbResidents.getById(resId);
  const array = resident.McBills;
  const count = array.length;
  if (count > 0) {
    for (const element of array) {
      unpaidMcTotal.MessOne += element.MessOne;
      unpaidMcTotal.MessTwo += element.MessTwo;
      unpaidMcTotal.Canteen += element.Canteen;
      unpaidMcTotal.MessFine += element.MessFine;
      unpaidMcTotal.CanteenFine += element.CanteenFine;
      unpaidMcTotal.Amenity += element.Amenity;
      unpaidMcTotal.HalfYearly += element.HalfYearly;
      unpaidMcTotal.HalfYearlyFine += element.HalfYearlyFine;
      unpaidMcTotal.Total += element.Total;
    }
    await dbResidents.replaceUnpaidMcTotal(resId, unpaidMcTotal);
  }
  await updateUnpaidMcTotalBillPeriod(resId);
};

const mcBillAddFine = async (resId, billId) => {
  let bill = {};
  bill = await dbMcBills.getBillForResident(resId, billId);
  const month = bill.BillPeriod;
  const fineMc = await dbFinesMc.getByMonth(month);
  if (fineMc) {
    const fine = fineMc.Mc;
    bill.MessFine = 0;
    bill.CanteenFine = 0;
    const hasMessFine =
      bill.HasMessFine && (bill.MessOne !== 0 || bill.MessTwo !== 0);
    const hasCanteenFine = bill.HasCanteenFine && bill.Canteen !== 0;
    if (hasMessFine) {
      if (bill.MessOne > 0) {
        bill.MessFine = fine > bill.MessOne ? bill.MessOne : fine;
      }
      if (bill.MessTwo > 0) {
        bill.MessFine = fine > bill.MessTwo ? bill.MessTwo : fine;
      }
    }
    if (hasCanteenFine) {
      bill.CanteenFine = fine > bill.Canteen ? bill.Canteen : fine;
    }
    if (bill.BillPeriod.includes("HYr")) {
      bill.HalfYearlyFine = fine;
    }
    bill.Total =
      bill.MessOne +
      bill.MessTwo +
      bill.Canteen +
      bill.MessFine +
      bill.CanteenFine +
      bill.Amenity +
      bill.HalfYearly +
      bill.HalfYearlyFine;
    await dbMcBills.replaceMcBill(resId, bill);
  }
};

const updateMcBills = async resId => {
  const resident = await dbResidents.getById(resId);
  if (resident !== null) {
    const array = resident.McBills;
    const count = array.length;
    if (count > 0) {
      await updateFinesMc();
      for (const element of array) {
        await mcBillAddFine(resId, element._id);
      }
    }
    await updateUnpaidMcTotal(resId);
  }
};

export default updateMcBills;
