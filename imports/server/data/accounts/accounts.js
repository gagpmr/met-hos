import updatePaBills from "./accountsPa";
import updateMcBills from "./accountsMc";
import dbResidents from "../../db/dbResidents";

const removeUndefinedAndNulls = async resId => {
  const nResident = await dbResidents.getById(resId);
  if (nResident !== null) {
    if (nResident.TxnMcBills === undefined || nResident.TxnMcBills === null) {
      nResident.TxnMcBills = [];
    }
    if (nResident.TxnPaBills === undefined || nResident.TxnPaBills === null) {
      nResident.TxnPaBills = [];
    }
    if (nResident.PaBills === undefined || nResident.PaBills === null) {
      nResident.PaBills = [];
    }
    if (nResident.McBills === undefined || nResident.McBills === null) {
      nResident.McBills = [];
    }
    if (
      nResident.ReturnAmount === undefined ||
      nResident.ReturnAmount === null
    ) {
      nResident.ReturnAmount = 0;
    }
    if (nResident.NetDues === undefined || nResident.NetDues === null) {
      nResident.NetDues = 0;
    }
    await dbResidents.replaceResident(nResident);
  }
};

const updateTransactionDetails = async resId => {
  const nResident = await dbResidents.getById(resId);
  if (nResident !== null) {
    nResident.TxnTotal = 0;
    nResident.TxnMcTotal = 0;
    nResident.TxnPaTotal = 0;
    nResident.TxnMcBills.forEach(doc => {
      nResident.TxnMcTotal += doc.Total;
    });
    nResident.TxnPaBills.forEach(doc => {
      nResident.TxnPaTotal += doc.Total;
    });
    nResident.TxnTotal = nResident.TxnMcTotal + nResident.TxnPaTotal;
    nResident.UnpaidTotal =
      nResident.UnpaidMcTotal.Total + nResident.UnpaidPaTotal.Total;
    nResident.NetDues = nResident.UnpaidTotal - nResident.ReturnAmount;
    await dbResidents.replaceResident(nResident);
  }
};

const processAccountPa = async resId => {
  await updatePaBills(resId);
};

const processAccountMc = async resId => {
  await updateMcBills(resId);
};

const processAccount = async resId => {
  const resident = await dbResidents.getById(resId);
  if (resident !== undefined) {
    await removeUndefinedAndNulls(resId);
    await processAccountPa(resId);
    await processAccountMc(resId);
    await updateTransactionDetails(resId);
  }
};

const Accounts = {
  processAccount,
  processAccountPa,
  processAccountMc
};

export default Accounts;
