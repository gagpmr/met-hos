import seeder from "@cleverbeagle/seeder";
import { Meteor } from "meteor/meteor";

seeder(Meteor.users, {
  environments: ["development", "production"],
  noLimit: true,
  data: [
    {
      email: "admin@admin.com",
      password: "*OU$H7JM7HG8EQW",
      profile: {
        name: {
          first: "Gagan",
          last: "Parmar"
        }
      },
      roles: ["admin"]
    }
  ]
});
