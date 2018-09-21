import Accounts from "../../../data/accounts/accounts";
import McDetailBills from "../../../data/mcDetailBills/mcDetailBills";
import PaDetailBills from "../../../data/paDetailBills/paDetailBills";
import dbMcDetails from "../../../db/dbMcDetails";
import dbPaDetails from "../../../db/dbPaDetails";
import dbTxnMcBills from "../../../db/dbTxnMcBills";
import dbTxnPaBills from "../../../db/dbTxnPaBills";

const addMcBill = async args => {
  await dbTxnMcBills.insertBill(args.resId, args.billId);
  await Accounts.processAccount(args.resId);
};

const removeMcBill = async args => {
  await dbTxnMcBills.removeBill(args.resId, args.billId);
  await Accounts.processAccount(args.resId);
};

const removeAllMc = async args => {
  await dbTxnMcBills.removeAll(args.resId);
  await Accounts.processAccount(args.resId);
};

const addAllMc = async args => {
  await dbTxnMcBills.addAll(args.resId);
  await Accounts.processAccount(args.resId);
};

const addAllPa = async args => {
  await dbTxnPaBills.addAll(args.resId);
  await Accounts.processAccount(args.resId);
};

const addPaBill = async args => {
  await dbTxnPaBills.insertBill(args.resId, args.billId);
  await Accounts.processAccount(args.resId);
};

const removePaBill = async args => {
  await dbTxnPaBills.removeBill(args.resId, args.billId);
  await Accounts.processAccount(args.resId);
};

const removeAllPa = async args => {
  await dbTxnPaBills.removeAll(args.resId);
  await Accounts.processAccount(args.resId);
};

const createDetail = async args => {
  const mcDetId = await McDetailBills.txnDetailMc(args);
  const paDetId = await PaDetailBills.txnDetailPa(args);
  const out = {
    mcDetId,
    paDetId
  };
  return out;
};

const getDetails = async args => {
  const paDetail = await dbPaDetails.getById(args.paDetId);
  const mcDetail = await dbMcDetails.getById(args.mcDetId);
  const out = {
    mcDetail,
    paDetail
  };
  return out;
};

const Transactions = {
  getDetails,
  createDetail,
  removePaBill,
  addPaBill,
  addAllPa,
  addAllMc,
  removeAllPa,
  removeAllMc,
  removeMcBill,
  addMcBill
};

export default Transactions;
