import Dates from "../dates/dates";
import dbMonthsMc from "/imports/server/db/dbMonthsMc";
import dbSessions from "/imports/server/db/dbSessions";
import moment from "moment";

const generateMcMonths = async () => {
  const nDate = await Dates.effectiveDate();
  const effectiveDate = nDate.EffectiveDateStr;
  const array = [];
  const sess = await dbSessions.getCurrentSession();
  const startYear = parseInt(sess.Value.substring(0, 4), 10);
  const endYear = startYear + 1;
  const month = {
    Value: `HYr, ${startYear}`,
    FineTwoDate: moment.utc(`31-12-${endYear}`, "DD-MM-YYYY").toDate(),
    FineThreeDate: moment.utc(`31-12-${endYear}`, "DD-MM-YYYY").toDate(),
    FineTwoMaxDays: 15,
    Selected: false
  };
  const monthOne = {
    Value: `HYr, ${endYear}`,
    FineTwoDate: moment.utc(`15-01-${endYear}`, "DD-MM-YYYY").toDate(),
    FineThreeDate: moment.utc(`30-01-${endYear}`, "DD-MM-YYYY").toDate(),
    FineTwoMaxDays: 15,
    Selected: false
  };
  const monthTwo = {
    Value: `HYr/2, ${endYear}`,
    FineTwoDate: moment.utc(`15-01-${endYear}`, "DD-MM-YYYY").toDate(),
    FineThreeDate: moment.utc(`30-01-${endYear}`, "DD-MM-YYYY").toDate(),
    FineTwoMaxDays: 15,
    Selected: false
  };
  array.push(month);
  array.push(monthOne);
  array.push(monthTwo);
  for (let i = 12; i > 0; i--) {
    const iterator = moment.utc(effectiveDate, "DD-MMM-YYYY");
    const newMonth = iterator.subtract(i, "months").format("MMM, YYYY");
    const fineTwoDate = moment
      .utc(effectiveDate, "DD-MMM-YYYY")
      .subtract(i, "months")
      .add(1, "months")
      .set("date", 15)
      .toDate();
    const fineThreeDate = moment
      .utc(effectiveDate, "DD-MMM-YYYY")
      .subtract(i, "months")
      .add(1, "months")
      .set("date", 15)
      .add(15, "days")
      .toDate();
    let selector = false;
    const newMonthOne = moment
      .utc(effectiveDate, "DD-MMM-YYYY")
      .subtract(1, "months")
      .format("MMM, YYYY");
    const fineTwoMaxDays = 15;
    if (newMonthOne === newMonth) {
      selector = true;
    }
    const element = {
      Value: newMonth,
      FineTwoDate: fineTwoDate,
      FineThreeDate: fineThreeDate,
      FineTwoMaxDays: fineTwoMaxDays,
      Selected: selector
    };
    array.push(element);
  }
  return array;
};

const insertMonths = async months => {
  for (const element of months) {
    const month = await dbMonthsMc.getByMonth(element.Value);
    if (month === null) {
      await dbMonthsMc.insert(element);
    }
  }
};

const updateMonthsMc = async () => {
  const nDate = await Dates.effectiveDate();
  const effectiveDate = nDate.EffectiveDateStr;
  const nMonth = moment
    .utc(effectiveDate, "DD-MMM-YYYY")
    .subtract(1, "months")
    .format("MMM, YYYY");
  const previousMonth = await dbMonthsMc.getByMonth(nMonth);
  const count = await dbMonthsMc.countAll();
  const check = previousMonth === null || count === 0;
  if (check) {
    await dbMonthsMc.removeAll();
    const months = await generateMcMonths();
    await insertMonths(months);
  }
};

export default updateMonthsMc;
