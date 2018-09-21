import { MongoClient, ObjectID } from "mongodb";

const dbTest = "MetHosTest";
let db = "hos_18_19";
let url = "mongodb://127.0.0.1:27017/";
if (process.env.MONGO_URL.includes(dbTest)) {
  url += dbTest;
  db = dbTest;
} else if (process.env.MONGO_URL.includes(db)) {
  url += db;
}

console.log(`Using Database: ${url}`);

const connectMongo = async () => {
  const dbConnect = await MongoClient.connect(
    url,
    { poolSize: 40 }
  );
  return {
    McMonthTotals: dbConnect.collection("McMonthTotals"),
    PaMonthTotals: dbConnect.collection("PaMonthTotals"),
    SaMonthTotals: dbConnect.collection("SaMonthTotals"),
    Residents: dbConnect.collection("Residents"),
    Rooms: dbConnect.collection("Rooms"),
    Categories: dbConnect.collection("Categories"),
    Classes: dbConnect.collection("Classes"),
    Dates: dbConnect.collection("Dates"),
    Holidays: dbConnect.collection("Holidays"),
    FinesMc: dbConnect.collection("Fines"),
    FinesPa: dbConnect.collection("PaFines"),
    MonthsMc: dbConnect.collection("McMonths"),
    MonthsPa: dbConnect.collection("PaMonths"),
    Sessions: dbConnect.collection("Sessions"),
    SaDetails: dbConnect.collection("SaDetails"),
    SaDayTotals: dbConnect.collection("SaDayTotals"),
    Values: dbConnect.collection("Values"),
    McDetails: dbConnect.collection("McDetails"),
    McDayTotals: dbConnect.collection("McDayTotals"),
    PaDetails: dbConnect.collection("PaDetails"),
    PaDayTotals: dbConnect.collection("PaDayTotals"),
    PaDetailBills: dbConnect.collection("PaDetailBills"),
    ObjectID,
    client: dbConnect
  };
};

export default connectMongo;
