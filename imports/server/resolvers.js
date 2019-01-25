import Classes from "./data/classes/classes";
import Dates from "./data/dates/dates";
import GraphQLJSON from "graphql-type-json";
import Holidays from "./data/holidays/holidays";
import McBills from "./data/residents/mcBills/index";
import McDayTotals from "./data/mcDayTotals/mcDayTotals";
import McDetailBills from "./data/mcDetailBills/mcDetailBills";
import McDetailsGet from "./data/mcDetails/mcDetailsGet";
import McDetailsPost from "./data/mcDetails/mcDetailsPost";
import McMonthTotals from "./data/mcMonthTotals/mcMonthTotals";
import PaBills from "./data/residents/paBills/index";
import PaDayTotals from "./data/paDayTotals/paDayTotals";
import PaDetailBills from "./data/paDetailBills/paDetailBills";
import PaDetailsGet from "./data/paDetails/paDetailsGet";
import PaDetailsPost from "./data/paDetails/paDetailsPost";
import PaMonthTotals from "./data/paMonthTotals/paMonthTotals";
import Residents from "./data/residents/residents";
import Rooms from "./data/rooms/rooms";
import SaDayTotals from "./data/saDayTotals/saDayTotals";
import SaDetailsGet from "./data/saDetails/saDetailsGet";
import SaDetailsPost from "./data/saDetails/saDetailsPost";
import SaMonthTotals from "./data/saMonthTotals/saMonthTotals";
import Sessions from "./data/sessions/sessions";
import Transactions from "./data/residents/transactions/index";

const queryResolver = {
  JSON: GraphQLJSON,

  Query: {
    test: async (_, args) => Residents.admissionDetails(args),
    admissionDetails: async (_, args) => Residents.admissionDetails(args),
    transactionDetails: async (_, args) => Transactions.getDetails(args),
    residentMcDetails: async (_, args) => McDetailsGet.getByResId(args),
    mcMonthlyPrint: async (_, args) => McMonthTotals.getById(args),
    mcMonthTotalsByPage: async (_, args) => McMonthTotals.getByPage(args),
    editMcDayTotal: async (_, args) => McDayTotals.getById(args),
    editMcDetail: async (_, args) => McDetailsGet.editMcDetail(args),
    mcDateDetails: async (_, args) => McDetailsGet.dateDetails(args),
    mcDayTotalsByPage: async (_, args) => McDayTotals.getByPage(args),
    residentPaDetails: async (_, args) => PaDetailsGet.getByResId(args),
    paMonthlyPrint: async (_, args) => PaMonthTotals.getById(args),
    paMonthTotalsByPage: async (_, args) => PaMonthTotals.getByPage(args),
    editPaDayTotal: async (_, args) => PaDayTotals.getById(args),
    editPaDetail: async (_, args) => PaDetailsGet.editPaDetail(args),
    paDateDetails: async (_, args) => PaDetailsGet.dateDetails(args),
    paDayTotalsByPage: async (_, args) => PaDayTotals.getByPage(args),
    residentSaDetails: async (_, args) => SaDetailsGet.getByResId(args),
    saMonthlyPrint: async (_, args) => SaMonthTotals.getById(args),
    saMonthTotalsByPage: async (_, args) => SaMonthTotals.getByPage(args),
    saDateDetails: async (_, args) => SaDetailsGet.dateDetails(args),
    editClass: async (_, args) => Classes.getById(args),
    classes: async () => Classes.getAll(),
    holidays: async () => Holidays.getAll(),
    editSession: async (_, args) => Sessions.getById(args),
    sessions: async () => Sessions.getAll(),
    effectiveDate: async () => Dates.effectiveDate(),
    priAccFine: async () => PaBills.priAccFine(),
    mesCanFine: async () => McBills.mesCanFine(),
    editSaDayTotal: async (_, args) => SaDayTotals.getById(args),
    rooms: async () => Rooms.getAll(),
    editResident: async (_, args) => Residents.editResident(args),
    residents: async () => Residents.getAll(),
    roomResidents: async (_, args) => Residents.getByRoomId(args),
    residentsRoomWise: async () => Residents.residentsRoomWise(),
    duesMessOne: async () => Residents.duesMessOne(),
    duesMessTwo: async () => Residents.duesMessTwo(),
    duesRegularResidents: async () => Residents.duesRegularResidents(),
    noticeList: async () => Residents.noticeListResidents(),
    residentDetails: async (_, args) => Residents.residentDetails(args),
    editPaBill: async (_, args) => PaBills.editPaBill(args),
    editMcBill: async (_, args) => McBills.editMcBill(args),
    editSaDetail: async (_, args) => SaDetailsGet.editSaDetail(args),
    saDayTotalsByPage: async (_, args) => SaDayTotals.getByPage(args)
  }
};

const mutationResolver = {
  Mutation: {
    removeMcMonth: async (_, args) => McMonthTotals.removeByMonth(args),
    autoDepositMcMonth: async (_, args) => McMonthTotals.autoDeposit(args),
    removeMcDayTotal: async (_, args) => McDayTotals.removeByDate(args),
    autoDepositMcDayTotal: async (_, args) => McDayTotals.autoDeposit(args),
    updateMcDayTotal: async (_, args) => McDayTotals.updateMcDayDeposits(args),
    updateMcDetail: async (_, args) => McDetailsPost.updateDetail(args),
    cancelledMcDetail: async (_, args) => McDetailsPost.cancelledMcDetail(args),
    removeMcDetail: async (_, args) => McDetailsPost.removeDetail(args),
    copyEditMcDetail: async (_, args) => McDetailsPost.copyEditMcDetail(args),
    removePaMonth: async (_, args) => PaMonthTotals.removeByMonth(args),
    autoDepositPaMonth: async (_, args) => PaMonthTotals.autoDeposit(args),
    removePaDayTotal: async (_, args) => PaDayTotals.removeByDate(args),
    autoDepositPaDayTotal: async (_, args) => PaDayTotals.autoDeposit(args),
    updatePaDayTotal: async (_, args) => PaDayTotals.updatePaDayDeposits(args),
    updatePaDetail: async (_, args) => PaDetailsPost.updateDetail(args),
    copyEditPaDetail: async (_, args) => PaDetailsPost.copyEditPaDetail(args),
    cancelledPaDetail: async (_, args) => PaDetailsPost.cancelledPaDetail(args),
    removePaDetail: async (_, args) => PaDetailsPost.removeDetail(args),
    removeSaMonth: async (_, args) => SaMonthTotals.removeByMonth(args),
    autoDepositSaMonth: async (_, args) => SaMonthTotals.autoDeposit(args),
    cancelledSaDetail: async (_, args) => SaDetailsPost.cancelledSaDetail(args),
    removeSaDetail: async (_, args) => SaDetailsPost.removeDetail(args),
    updateClass: async (_, args) => Classes.updateClass(args),
    srNoMax: async (_, args) => Classes.srNoMax(args),
    srNoUp: async (_, args) => Classes.srNoUp(args),
    srNoDown: async (_, args) => Classes.srNoDown(args),
    insertClass: async (_, args) => Classes.insertClass(args),
    removeClass: async (_, args) => Classes.removeClass(args),
    updateResident: async (_, args) => Residents.updateResident(args),
    insertHoliday: async (_, args) => Holidays.insertHoliday(args),
    removeHoliday: async (_, args) => Holidays.removeHoliday(args),
    copyEditSession: async (_, args) => Sessions.copyEditSession(args),
    updateSession: async (_, args) => Sessions.updateSession(args),
    removeSession: async (_, args) => Sessions.removeSession(args),
    sixMonths: async (_, args) => Residents.sixMonths(args),
    txnDetailBoth: async (_, args) => Transactions.createDetail(args),
    txnDetailPa: async (_, args) => PaDetailBills.txnDetailPa(args),
    txnDetailMc: async (_, args) => McDetailBills.txnDetailMc(args),
    mcDetailBillAll: async (_, args) =>
      McDetailBills.createDetailAllBills(args),
    mcDetailBill: async (_, args) => McDetailBills.createDetail(args),
    paDetailBillAll: async (_, args) =>
      PaDetailBills.createDetailAllBills(args),
    paDetailBill: async (_, args) => PaDetailBills.createDetail(args),
    txnRemovePaBill: async (_, args) => Transactions.removePaBill(args),
    txnAddPaBill: async (_, args) => Transactions.addPaBill(args),
    txnAddAllPa: async (_, args) => Transactions.addAllPa(args),
    txnAddAllMc: async (_, args) => Transactions.addAllMc(args),
    txnRemoveAllPa: async (_, args) => Transactions.removeAllPa(args),
    txnRemoveAllMc: async (_, args) => Transactions.removeAllMc(args),
    txnRemoveMcBill: async (_, args) => Transactions.removeMcBill(args),
    txnAddMcBill: async (_, args) => Transactions.addMcBill(args),
    dateAutoGenerate: async () => Dates.autoGenerate(),
    updateDate: async (_, args) => Dates.updateDate(args),
    updateSaDayTotal: async (_, args) => SaDayTotals.updateSaDayDeposits(args),
    removeResident: async (_, args) => Residents.removeResident(args),
    duesListTrue: async (_, args) => Residents.duesListTrue(args),
    duesListFalse: async (_, args) => Residents.duesListFalse(args),
    noticeListTrue: async (_, args) => Residents.noticeListTrue(args),
    noticeListFalse: async (_, args) => Residents.noticeListFalse(args),
    editReturnAmount: async (_, args) => Residents.editReturnAmount(args),
    addPaBill: async (_, args) => PaBills.addPaBill(args),
    addMcBill: async (_, args) => McBills.addMcBill(args),
    updatePaBill: async (_, args) => PaBills.updatePaBill(args),
    updateMcBill: async (_, args) => McBills.updateMcBill(args),
    updateMcBillType: async (_, args) => McBills.updateMcBillType(args),
    updatePaBillType: async (_, args) => PaBills.updatePaBillType(args),
    removePaBill: async (_, args) => PaBills.removePaBill(args),
    removeMcBill: async (_, args) => McBills.removeMcBill(args),
    removeSaDayTotal: async (_, args) => SaDayTotals.removeByDate(args),
    createSaDetail: async (_, args) => SaDetailsPost.createSaDetail(args),
    updateSaDetail: async (_, args) => SaDetailsPost.updateSaDetail(args),
    autoDepositSaDayTotal: async (_, args) => SaDayTotals.autoDeposit(args)
  }
};

const resolvers = [queryResolver, mutationResolver];

export default resolvers;
