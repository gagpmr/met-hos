import dbClasses from "../../db/dbClasses";

const removeClass = async args => {
  await dbClasses.remove(args.classId);
  return "Class Removed";
};

const getAll = async () => {
  return await dbClasses.getAll();
};

const insertClass = async args => {
  await dbClasses.insert(args.classId, args.srNo);
  return "Class Inserted";
};

const srNoDown = async args => {
  await dbClasses.srNoDown(args.classId, args.srNo);
  return "Class SrNo Decreased";
};

const srNoUp = async args => {
  await dbClasses.srNoUp(args.classId, args.srNo);
  return "Class SrNo Increased";
};

const srNoMax = async args => {
  await dbClasses.srNoMax(args.classId, args.srNo);
  return "Class SrNo Maximum";
};

const getById = async args => {
  return await dbClasses.getById(args.classId);
};

const updateClass = async args => {
  await dbClasses.updateValue(args.classId, args.value);
  return "Class Updated";
};

const Classes = {
  updateClass,
  getById,
  srNoMax,
  srNoUp,
  srNoDown,
  insertClass,
  removeClass,
  getAll
};

export default Classes;
