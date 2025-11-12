import "dotenv/config";
import { config, createSchema } from "@keystone-next/keystone/schema";
import { createAuth } from "@keystone-next/auth";
import {
  withItemData,
  statelessSessions,
} from "@keystone-next/keystone/session";
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { insertSeedData } from "./seed-data";
import { sendPasswordResetEmail } from "./lib/mail";
import { CartItem } from "./schemas/CartItem";
import { extendGraphqlSchema } from "./mutations";
import { OrderItem } from "./schemas/OrderItems";
import { Order } from "./schemas/Order";

const databaseURL =
  process.env.DATABASE_URL || "mongodb://localhost/keystone-sick-fits-tutorial";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    // ToDo: add in initial roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

export default withAuth(
  config({
    // @ts-ignore
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: "mongoose",
      url: databaseURL,
      // add data seeding here
      async onConnect(keystone) {
        console.log("...connected to the database");
        if (process.argv.includes("--seed-data")) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // Schema items go in here
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
    }),
    extendGraphqlSchema,
    ui: {
      //  TODO: change this for roles
      isAccessAllowed: ({ session }) =>
        // console.log(session);
        !!session?.data,
    },
    //   TODO: add session values here
    session: withItemData(statelessSessions(sessionConfig), {
      // GraphQL Query to get more information about the user
      User: "id name email",
    }),
  })
);
