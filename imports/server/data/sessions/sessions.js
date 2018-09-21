import dbSessions from "../../db/dbSessions";

const copyEditSession = async args => {
  const id = await dbSessions.copySession(args.sessId);
  return id;
};

const updateSession = async args => {
  const session = Object.assign({}, args);
  session._id = args.sessId;
  session.srNo = parseInt(args.srNo, 10);
  session.hostelSecurity = parseInt(args.hostelSecurity, 10);
  session.messSecurity = parseInt(args.messSecurity, 10);
  session.canteenSecurity = parseInt(args.canteenSecurity, 10);
  session.totalSecurity = parseInt(args.totalSecurity, 10);
  session.messAmenity = parseInt(args.messAmenity, 10);
  session.canteenAmenity = parseInt(args.canteenAmenity, 10);
  session.poorStuWelFund = parseInt(args.poorStuWelFund, 10);
  session.mcServantWelFund = parseInt(args.mcServantWelFund, 10);
  session.celebrationFund = parseInt(args.celebrationFund, 10);
  session.developmentFund = parseInt(args.developmentFund, 10);
  session.rutineHstlMaintnceCharges = parseInt(
    args.rutineHstlMaintnceCharges,
    10
  );
  session.continuationCharges = parseInt(args.continuationCharges, 10);
  session.dailyCharges = parseInt(args.dailyCharges, 10);
  session.roomRent = parseInt(args.roomRent, 10);
  session.waterCharges = parseInt(args.waterCharges, 10);
  session.foodSubsidy = parseInt(args.foodSubsidy, 10);
  session.electricityCharges = parseInt(args.electricityCharges, 10);
  dbSessions.updateSession(session);
  return "Session Updated";
};

const getById = async args => {
  const session = await dbSessions.getById(args.sessId);
  return session;
};

const removeSession = async args => {
  await dbSessions.removeSession(args.sessId);
};

const getAll = async () => {
  return await dbSessions.getAll();
};

const Sessions = {
  copyEditSession,
  updateSession,
  getById,
  removeSession,
  getAll
};

export default Sessions;
