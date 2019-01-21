import Dates from "../dates/dates";
import dbFinesPa from "../../db/dbFinesPa";
import dbMonthsPa from "../../db/dbMonthsPa";
import updateMonthsPa from "../../data/monthsPa/monthsPa";

const insertFine = async fine => {
  let count = 0;
  count = await dbFinesPa.countFindByMonthAndEffectiveDate(
    fine.PaMonth,
    fine.EffectiveDateStr
  );
  if (count === 0) {
    await dbFinesPa.insert(fine);
  }
};

const insertForMonthPa = async paMonth => {
  const ef = await Dates.effectiveDate();
  const dayDiff = Math.floor(
    (ef.EffectiveDate - paMonth.FineTwoDate) / (1000 * 60 * 60 * 24)
  );
  let dayDiffThree = 0;
  const fine = {
    ActualDate: ef.ActualDate,
    EffectiveDate: ef.EffectiveDate,
    EffectiveDateStr: ef.EffectiveDateStr,
    PaMonth: paMonth.Value
  };
  if (dayDiff > 0) {
    if (dayDiff < paMonth.FineTwoMaxDays) {
      const fineTwo = dayDiff * 2;
      fine.Pa = fineTwo;
    } else {
      dayDiffThree = Math.floor(
        (ef.EffectiveDate - paMonth.FineThreeDate) / (1000 * 60 * 60 * 24)
      );
      const fineTwo = paMonth.FineTwoMaxDays * 2;
      const fineThree = dayDiffThree * 3;
      const fineTotal = fineTwo + fineThree;
      fine.Pa = fineTotal;
    }
  } else {
    fine.Pa = 0;
  }
  await insertFine(fine);
};

const updateFinesPa = async () => {
  await updateMonthsPa();
  const ef = await Dates.effectiveDate();

  const finesPa = await dbFinesPa.getAll();
  for (const finePa of finesPa) {
    if (finePa.EffectiveDateStr !== ef.EffectiveDateStr) {
      await dbFinesPa.remove(finePa._id);
    }
  }

  const paMonths = await dbMonthsPa.getAll();
  for (const paMonth of paMonths) {
    await insertForMonthPa(paMonth);
  }
};

export default updateFinesPa;
