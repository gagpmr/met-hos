import dbRemoResidents from "../../db/dbRemoResidents";
import dbResidents from "../../db/dbResidents";

const create = async resId => {
  const res = await dbResidents.getById(resId);
  const def = await dbRemoResidents.getDefault();
  def.Name = res.Name;
  def.FatherName = res.FatherName;
  def.RollNumber = res.RollNumber;
  def.TelephoneNumber = res.TelephoneNumber;
  def.Room = res.Room.Value;
  def.Class = res.Class.Value;
  await dbRemoResidents.insert(def);
};

const RemoResidents = {
  create
};

export default RemoResidents;
