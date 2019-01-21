import connectMongo from "../../server/connector";

const countAll = async () => {
  const mongo = await connectMongo();
  const count = await mongo.Dates.find().count();
  await mongo.client.close();
  return count;
};

const insert = async date => {
  const mongo = await connectMongo();
  await mongo.Dates.insert(date);
  await mongo.client.close();
};

const setActualDateAndDeadLine = async (dateId, actualDate, deadLine) => {
  const mongo = await connectMongo();
  await mongo.Dates.update(
    {
      _id: dateId
    },
    {
      $set: {
        ActualDate: actualDate,
        DeadLineCrossed: deadLine
      }
    }
  );
  await mongo.client.close();
};

const setEffectiveDate = async (dateId, effectiveDate) => {
  const mongo = await connectMongo();
  await mongo.Dates.update(
    {
      _id: dateId
    },
    {
      $set: {
        EffectiveDate: effectiveDate.toDate(),
        EffectiveDateStr: effectiveDate.format("DD-MMM-YYYY")
      }
    }
  );
  await mongo.client.close();
};

const setAutoGenerate = async (dateId, autoBool) => {
  const mongo = await connectMongo();
  await mongo.Dates.update(
    {
      _id: dateId
    },
    {
      $set: {
        AutoGenerate: autoBool
      }
    }
  );
  await mongo.client.close();
};

const getDate = async () => {
  const mongo = await connectMongo();
  const date = await mongo.Dates.findOne({});
  await mongo.client.close();
  return date;
};

const updateDate = async (date, dateStr) => {
  const mongo = await connectMongo();
  const dbDate = await mongo.Dates.findOne();
  const id = dbDate._id;
  await mongo.Dates.update(
    {
      _id: id
    },
    {
      $set: {
        DeadLineCrossed: false,
        ActualDate: dateStr,
        EffectiveDateStr: dateStr,
        EffectiveDate: date,
        AutoGenerate: false
      }
    }
  );
  await mongo.client.close();
};

const autoGenerate = async () => {
  const mongo = await connectMongo();
  const dbDate = await mongo.Dates.findOne();
  const id = dbDate._id;
  await mongo.Dates.update(
    {
      _id: id
    },
    {
      $set: {
        AutoGenerate: true
      }
    }
  );
  await mongo.client.close();
};

const dbDates = {
  autoGenerate,
  updateDate,
  insert,
  getDate,
  countAll,
  setAutoGenerate,
  setEffectiveDate,
  setActualDateAndDeadLine
};

export default dbDates;
