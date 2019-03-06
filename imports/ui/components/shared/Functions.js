export const handleChange = (e, client) => {
  const { type, checked, value, name } = e.target;
  const nValue = type === "checkbox" ? checked : value;
  client.writeData({
    data: { [name]: nValue }
  });
};

export const keyPressed = (e, client, component) => {
  if (e.key === "Enter") {
    component.handleSubmit(e, client);
  }
}