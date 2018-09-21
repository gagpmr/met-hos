import dbRooms from "/imports/server/db/dbRooms";

const getAll = async () => {
  return await dbRooms.getAll();
};

const Rooms = {
  getAll
};

export default Rooms;
