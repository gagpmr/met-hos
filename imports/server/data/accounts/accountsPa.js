import updateFinesPa from "/imports/server/data/finesPa/finesPa";
import dbPaBills from "/imports/server/db/dbPaBills";
import dbResidents from "/imports/server/db/dbResidents";
import dbFinesPa from "/imports/server/db/dbFinesPa";

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
    const month = `${firstBill.BillPeriod.substring(0, 3)} - ${
      lastBill.BillPeriod
    }`;
    name = month;
  }
  return name;
};

const updateUnpaidPaTotalBillPeriod = async resId => {
  const resident = await dbResidents.getById(resId);
  const array = resident.PaBills;
  const name = await unpaidTotalBillPeriod(array);
  const unpaidPaTotal = resident.UnpaidPaTotal;
  unpaidPaTotal.BillPeriod = name;
  await dbResidents.replaceUnpaidPaTotal(resId, unpaidPaTotal);
};

const updateUnpaidPaTotal = async resId => {
  const unpaidPaTotal = {
    BillPeriod: "Unpaid Total",
    RoomRent: 0,
    WaterCharges: 0,
    ElectricityCharges: 0,
    HalfYearly: 0,
    HalfYearlyFine: 0,
    Miscellaneous: 0,
    Security: 0,
    Total: 0
  };
  await dbResidents.replaceUnpaidPaTotal(resId, unpaidPaTotal);
  const resident = await dbResidents.getById(resId);
  const array = resident.PaBills;
  const count = array.length;
  if (count > 0) {
    for (const element of array) {
      unpaidPaTotal.RoomRent += element.RoomRent;
      unpaidPaTotal.WaterCharges += element.WaterCharges;
      unpaidPaTotal.ElectricityCharges += element.ElectricityCharges;
      unpaidPaTotal.Security += element.Security;
      unpaidPaTotal.HalfYearly += element.HalfYearly;
      unpaidPaTotal.Miscellaneous += element.Miscellaneous;
      unpaidPaTotal.Total += element.Total;
    }
    await dbResidents.replaceUnpaidPaTotal(resId, unpaidPaTotal);
  }
  await updateUnpaidPaTotalBillPeriod(resId);
};

const paBillAddFine = async (resId, billId) => {
  let bill = {};
  bill = await dbPaBills.getBillForResident(resId, billId);
  const month = bill.BillPeriod;
  const finePa = await dbFinesPa.getByMonth(month);
  if (finePa && finePa.Pa !== 0) {
    const fine = finePa.Pa;
    bill.Miscellaneous = fine;
    bill.Total =
      bill.RoomRent +
      bill.WaterCharges +
      bill.ElectricityCharges +
      bill.Security +
      bill.HalfYearly +
      bill.Miscellaneous;
    await dbPaBills.replacePaBill(resId, bill);
  }
};

const updatePaBills = async resId => {
  const resident = await dbResidents.getById(resId);
  if (resident !== null) {
    const array = resident.PaBills;
    const count = array.length;
    if (count > 0) {
      await updateFinesPa();
      for (const element of array) {
        await paBillAddFine(resId, element._id);
      }
    }
    await updateUnpaidPaTotal(resId);
  }
};

export default updatePaBills;
