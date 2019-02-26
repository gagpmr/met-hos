const resolvers = {
  Query: {
    login: async (_, args, context) => {
      console.log(`args: ${args}`);
      console.log(`context: ${context}`);
    }
  }
};

export default resolvers;
