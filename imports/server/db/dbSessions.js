import connectMongo from "../../server/connector";

const getSessionSuffix = async value => {
  const mongo = await connectMongo();
  const session = await mongo.Sessions.findOne({ Value: value });
  return session.Suffix;
};

const copySession = async sessId => {
  const mongo = await connectMongo();
  const session = await mongo.Sessions.findOne({ _id: sessId });
  delete session._id;
  session._id = await new mongo.ObjectID().toString();
  await mongo.Sessions.insert(session);
  return session._id;
};

const updateSession = async session => {
  const mongo = await connectMongo();
  await mongo.Sessions.update({}, { $set: { Focus: false } });
  if (session.isCurrentSession) {
    await mongo.Sessions.update({}, { $set: { IsCurrentSession: false } });
  }
  await mongo.Sessions.update(
    { _id: session._id },
    {
      $set: {
        SrNo: session.srNo,
        IsCurrentSession: session.isCurrentSession,
        Value: session.value,
        Suffix: session.suffix,
        HostelSecurity: session.hostelSecurity,
        MessSecurity: session.messSecurity,
        CanteenSecurity: session.canteenSecurity,
        TotalSecurity: session.totalSecurity,
        MessAmenity: session.messAmenity,
        CanteenAmenity: session.canteenAmenity,
        PoorStuWelFund: session.poorStuWelFund,
        McServantWelFund: session.mcServantWelFund,
        CelebrationFund: session.celebrationFund,
        DevelopmentFund: session.developmentFund,
        RutineHstlMaintnceCharges: session.rutineHstlMaintnceCharges,
        ContinuationCharges: session.continuationCharges,
        DailyCharges: session.dailyCharges,
        RoomRent: session.roomRent,
        WaterCharges: session.waterCharges,
        FoodSubsidy: session.foodSubsidy,
        ElectricityCharges: session.electricityCharges,
        Focus: true
      }
    }
  );
  await mongo.client.close();
};

const getById = async sessId => {
  const mongo = await connectMongo();
  const session = await mongo.Sessions.findOne({ _id: sessId });
  await mongo.client.close();
  return session;
};

const removeSession = async sessId => {
  const mongo = await connectMongo();
  await mongo.Sessions.remove({ _id: sessId });
  await mongo.client.close();
};

const getAll = async () => {
  const mongo = await connectMongo();
  const sessions = await mongo.Sessions.find({})
    .sort({ SrNo: 1 })
    .toArray();
  await mongo.client.close();
  return sessions;
};

const getCurrentSession = async () => {
  const mongo = await connectMongo();
  const sess = await mongo.Sessions.findOne({ IsCurrentSession: true });
  await mongo.client.close();
  return sess;
};

const dbSessions = {
  getSessionSuffix,
  copySession,
  updateSession,
  getById,
  removeSession,
  getAll,
  getCurrentSession
};

export default dbSessions;
