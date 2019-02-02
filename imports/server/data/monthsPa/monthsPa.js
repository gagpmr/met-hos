import dbMonthsPa from "../../db/dbMonthsPa";
import dbSessions from "../../db/dbSessions";
import moment from "moment";

const getStartYear = async session => {
  let year = 0;
  year = parseInt(session.substring(0, 4), 10);
  return year;
};

const monthsDistint = async () => {
  const months = [];
  const sess = await dbSessions.getCurrentSession();
  const startYear = await getStartYear(sess.Value);
  const endYear = startYear + 1;
  months.push({
    Value: `1st HYr, ${startYear} - ${endYear}`,
    Months: 6,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: true
  });
  months.push({
    Value: `Jul-Sep, ${startYear}`,
    Months: 3,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: true
  });
  months.push({
    Value: `Oct-Dec, ${startYear}`,
    Months: 3,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: true
  });
  months.push({
    Value: `2nd HYr, ${startYear} - ${endYear}`,
    Months: 6,
    FineTwoDate: `15-01-${endYear}`,
    HasHalfYearly: true
  });
  months.push({
    Value: `Jan-Mar, ${endYear}`,
    Months: 3,
    FineTwoDate: `15-01-${endYear}`,
    HasHalfYearly: true
  });
  months.push({
    Value: `Apr-15 May, ${endYear}`,
    Months: 1.5,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: false
  });
  months.push({
    Value: `Apr-31 May, ${endYear}`,
    Months: 2,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: true
  });
  months.push({
    Value: `Apr-15 Jun, ${endYear}`,
    Months: 2.5,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: true
  });
  months.push({
    Value: `Apr-30 Jun, ${endYear}`,
    Months: 3,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: true
  });
  months.push({
    Value: `Jun-15 Jun, ${endYear}`,
    Months: 0.5,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: false
  });
  months.push({
    Value: `15 Jun-30 Jun, ${endYear}`,
    Months: 0.5,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: false
  });
  months.push({
    Value: `1 Jun-30 Jun, ${endYear}`,
    Months: 1,
    FineTwoDate: `31-12-${endYear}`,
    HasHalfYearly: false
  });
  return months;
};

const getPaMonths = async () => {
  const distintMonths = await monthsDistint();
  const sess = await dbSessions.getCurrentSession();
  const array = [];
  let RoomRent = 0;
  let WaterCharges = 0;
  let ElectricityCharges = 0;
  for (const element of distintMonths) {
    RoomRent = sess.RoomRent * element.Months;
    WaterCharges = sess.WaterCharges * element.Months;
    ElectricityCharges = sess.ElectricityCharges * element.Months;
    // For Session 2018-19 (Half Yearly Electricity Charges not divisible by 6)
    if (ElectricityCharges === 2502) {
      ElectricityCharges = 2500;
    } else if (ElectricityCharges === 1251) {
      ElectricityCharges = 1250;
    }
    // For Session 2018-19 --End
    const halfYearly = sess.RutineHstlMaintnceCharges + sess.DevelopmentFund;
    let halfYearlyForElement = 0;
    if (element.HasHalfYearly) {
      if (element.Months > 1.5 && element.Months < 3) {
        halfYearlyForElement = halfYearly / 2;
      } else if (element.Months >= 3) {
        const numerator = halfYearly * element.Months;
        halfYearlyForElement = numerator / 6;
      }
    }
    const FineThreeDate = moment
      .utc(element.FineTwoDate, "DD-MM-YYYY")
      .add(15, "days")
      .toDate();
    array.push({
      Value: element.Value,
      FineTwoDate: moment.utc(element.FineTwoDate, "DD-MM-YYYY").toDate(),
      FineThreeDate,
      FineTwoMaxDays: 15,
      Selected: false,
      Session: sess.Value,
      RoomRent,
      WaterCharges,
      ElectricityCharges,
      HalfYearly: halfYearlyForElement
    });
  }
  return array;
};

const updateMonthsPa = async () => {
  const any = await dbMonthsPa.getAny();
  let sessPresent = "";
  if (any !== null) {
    sessPresent = any.Session;
  }
  const month = moment
    .utc()
    .utcOffset(+5.5)
    .toDate()
    .getMonth();
  const sess = await dbSessions.getCurrentSession();
  const startYear = await getStartYear(sess.Value);
  if (sessPresent !== sess.Value) {
    const months = await getPaMonths();
    await dbMonthsPa.setAllFalse();
    for (const element of months) {
      if (element.Value.includes(`1st HYr, ${startYear}`) && month >= 6) {
        element.Selected = true;
        await dbMonthsPa.insert(element);
      } else if (element.Value.includes(`2nd HYr, ${startYear}`) && month < 6) {
        element.Selected = true;
        await dbMonthsPa.insert(element);
      } else {
        await dbMonthsPa.insert(element);
      }
    }
  }
};

export default updateMonthsPa;
