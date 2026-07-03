import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  statelessSessions,
  withItemData,
} from '@keystone-next/keystone/session';
import 'dotenv/config';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';
import { CartItem } from './schemas/CartItem';
import { Category } from './schemas/Category';
import { Order } from './schemas/Order';
import { OrderItem } from './schemas/OrderItems';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { Role } from './schemas/Role';
import { User } from './schemas/User';
import { permissionsList } from './schemas/fields';
import { insertSeedData } from './seed-data';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

// The patched statelessSessions (see patches/@keystone-next+keystone+9.3.1.patch)
// destructures sameSite and secure as TOP-LEVEL properties, not from a nested
// cookie object. Nesting them under `cookie: {}` meant they were never read,
// so sameSite silently defaulted to 'lax' — which blocks cross-origin cookies
// when the frontend (Vercel) and backend are on different domains.
const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they stay signed in?
  secret: process.env.COOKIE_SECRET,
  sameSite: 'none', // must be 'none' for cross-domain cookie delivery
  secure: true, // required when sameSite is 'none'
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
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
        origin: [
          'http://localhost:7777',
          'https://trendyfits-ah7ve65rl-owens-projects-9e1990f8.vercel.app',
          'https://trendyfits.vercel.app',
          process.env.FRONTEND_URL || 'https://trendyfits.vercel.app',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // add data seeding here
      async onConnect(keystone) {
        console.log('...connected to the database');
        if (process.argv.includes('--seed-data')) {
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
      Role,
      Category,
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
      User: `id name email role { ${permissionsList.join(' ')}}`,
    }),
  }),
);
