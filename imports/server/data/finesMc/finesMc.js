import Dates from "/imports/server/data/dates/dates";
import dbFinesMc from "/imports/server/db/dbFinesMc";
import dbMonthsMc from "/imports/server/db/dbMonthsMc";
import updateMcMonths from "../monthsMc/monthsMc";

const insertFine = async fine => {
  let count = 0;
  count = await dbFinesMc.countFindByMonthAndEffectiveDate(
    fine.McMonth,
    fine.EffectiveDateStr
  );
  if (count === 0) {
    await dbFinesMc.insert(fine);
  }
};

const insertForMonthMc = async mcMonth => {
  const ef = await Dates.effectiveDate();
  const dayDiff = Math.floor(
    (ef.EffectiveDate - mcMonth.FineTwoDate) / (1000 * 60 * 60 * 24)
  );
  const fine = {
    ActualDate: ef.ActualDate,
    EffectiveDate: ef.EffectiveDate,
    EffectiveDateStr: ef.EffectiveDateStr,
    McMonth: mcMonth.Value
  };
  if (dayDiff > 0) {
    if (dayDiff < mcMonth.FineTwoMaxDays) {
      const fineTwo = dayDiff * 2;
      fine.Mc = fineTwo;
    } else {
      const dayDiffThree = Math.floor(
        (ef.EffectiveDate - mcMonth.FineThreeDate) / (1000 * 60 * 60 * 24)
      );
      const fineTwo = mcMonth.FineTwoMaxDays * 2;
      const fineThree = dayDiffThree * 3;
      const fineTotal = fineTwo + fineThree;
      fine.Mc = fineTotal;
    }
  } else {
    fine.Mc = 0;
  }
  await insertFine(fine);
};

const updateFinesMc = async () => {
  await updateMcMonths();
  const ef = await Dates.effectiveDate();

  const finesMc = await dbFinesMc.getAll();
  for (const fineMc of finesMc) {
    if (fineMc.EffectiveDateStr !== ef.EffectiveDateStr) {
      await dbFinesMc.remove(fineMc._id);
    }
  }

  const mcMonths = await dbMonthsMc.getAll();
  for (const mcMonth of mcMonths) {
    await insertForMonthMc(mcMonth);
  }
};

export default updateFinesMc;
