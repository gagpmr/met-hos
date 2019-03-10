import gql from "graphql-tag";
import moment from "moment";

export const handleChange = (e, client) => {
  if (e.target) {
    const { type, checked, value, name } = e.target;
    const nValue = type === "checkbox" ? checked : value;
    client.writeData({
      data: { [name]: nValue }
    });
  }
};

export const keyPressed = (e, client, history, submit) => {
  if (e.key === "Enter") {
    submit(e, client, history);
  }
};

export const changeDate = (date, client, name) => {
  const nDate = moment.utc(date).format("DD-MM-YYYY");
  client.writeData({
    data: { [name]: nDate }
  });
};
