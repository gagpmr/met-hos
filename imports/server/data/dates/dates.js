import dbDates from "/imports/server/db/dbDates";
import dbHolidays from "/imports/server/db/dbHolidays";
import moment from "moment";

const isWorkingDate = async date => {
  const day = date.format("ddd");
  if (day === "Sat" || day === "Sun") {
    return false;
  }
  const asString = date.format("DD-MMM-YYYY");
  const result = await dbHolidays.countFindByValue(asString);
  if (result !== 0) {
    return false;
  }
  return true;
};

const isDeadLineCrossed = async () => {
  const now = moment.utc().utcOffset(+5.5);
  const nowHour = now.hour();
  const nowMinutes = now.minutes();
  const deadLineHour = 12;
  const deadLineMinute = 30;
  if (nowHour > deadLineHour) {
    return true;
  }
  if (now.hour() === deadLineHour) {
    if (nowMinutes > deadLineMinute) {
      return true;
    }
    return false;
  }
  return false;
};

const getNextWorkingDate = async () => {
  const now = moment.utc().utcOffset(+5.5);
  // If date is today
  const asString = moment
    .utc()
    .utcOffset(+5.5)
    .format("DD-MMM-YYYY");
  const dateOne = moment.utc(asString, "DD-MMM-YYYY");
  if (await isWorkingDate(now)) {
    if (await isDeadLineCrossed()) {
      const date = moment.utc(asString, "DD-MMM-YYYY").add(1, "days");
      if (await isWorkingDate(date)) {
        return date;
      }
      for (let index = 1; index < 20; index++) {
        const nDate = moment.utc(asString, "DD-MMM-YYYY").add(index, "days");
        if (await isWorkingDate(nDate)) {
          return nDate;
        }
        continue;
      }
    }
    return dateOne;
  }
  // If date is not today
  for (let index = 1; index < 20; index++) {
    const nDate = moment.utc(asString, "DD-MMM-YYYY").add(index, "days");
    if (await isWorkingDate(nDate)) {
      return nDate;
    }
    continue;
  }
  return dateOne;
};

const insertDate = async () => {
  const now = moment.utc().utcOffset(+5.5);
  const actualDate = now.format("DD-MMM-YYYY");
  const count = await dbDates.countAll();
  if (count === 0) {
    const newDate = {
      ActualDate: actualDate,
      AutoGenerate: true,
      EffectiveDate: moment.utc(actualDate, "DD-MMM-YYYY").toDate(),
      EffectiveDateStr: actualDate
    };
    await dbDates.insert(newDate);
  }
};

const update = async () => {
  const now = moment.utc().utcOffset(+5.5);
  const actualDate = now.format("DD-MMM-YYYY");
  await insertDate();
  const findDate = await dbDates.getDate();
  const dateId = findDate._id;
  const deadLine = await isDeadLineCrossed();
  await dbDates.setActualDateAndDeadLine(dateId, actualDate, deadLine);
  if (findDate.AutoGenerate) {
    const nWD = await getNextWorkingDate();
    await dbDates.setEffectiveDate(dateId, nWD);
  }
  return true;
};

const setAutoGenerate = async () => {
  const date = await dbDates.getDate();
  await dbDates.setAutoGenerate(date._id, true);
};

const effectiveDate = async () => {
  await update();
  const date = await dbDates.getDate();
  if (date.AutoGenerate === undefined) {
    await setAutoGenerate();
  }
  return await dbDates.getDate();
};

const updateDate = async args => {
  const date = moment.utc(args.effectiveDate, "DD-MMM-YYYY").toDate();
  dbDates.updateDate(date, args.effectiveDate);
};

const Dates = {
  autoGenerate: dbDates.autoGenerate,
  effectiveDate,
  updateDate
};

export default Dates;
