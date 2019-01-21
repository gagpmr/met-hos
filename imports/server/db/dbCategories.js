import connectMongo from "../../server/connector";

const getByValue = async value => {
  const mongo = await connectMongo();
  const category = await mongo.Categories.findOne({ Value: value });
  await mongo.client.close();
  return category;
};

const getAll = async () => {
  const mongo = await connectMongo();
  const categories = await mongo.Categories.find({})
    .sort({ Value: 1 })
    .toArray();
  await mongo.client.close();
  return categories;
};

const dbCategories = {
  getByValue,
  getAll
};

export default dbCategories;
