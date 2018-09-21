import dbHolidays from "../../db/dbHolidays";

const insertHoliday = async args => {
  await dbHolidays.insert(args.date);
  return "Holiday Inserted";
};

const removeHoliday = async args => {
  await dbHolidays.remove(args.id);
  return "Holiday Removed";
};

const getAll = async () => {
  const holidays = await dbHolidays.getAll();
  return holidays;
};

const Holidays = {
  insertHoliday,
  removeHoliday,
  getAll
};

export default Holidays;
