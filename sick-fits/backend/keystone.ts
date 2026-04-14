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

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they stay signed in?
  secret: process.env.COOKIE_SECRET,
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
          process.env.FRONTEND_URL || 'http://localhost:7777',
          'https://advanced-react-sickfits.vercel.app',
          'https://trendyfits-5z7gm0u5t-owens-projects-9e1990f8.vercel.app',
        ],
        credentials: true,
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
