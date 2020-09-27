
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";
import fs from 'fs';


export class UserProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "User";
  }


  async exportUsers() {

    const {
      db,
    } = this.ctx;

    let result = false;

    const users = await db.query.users({
      // first: 1,
      orderBy: "createdAt_ASC",
    }, `
      {
        id
        username
        fullname
        password
      }
    `);

    fs.writeFileSync('src/server/seed/data/users.json', JSON.stringify(users, true, 2), {
      flag: "w+",
    });

    result = true;

    return result;
  }
}


export default class UserModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return UserProcessor;
  }


  getResolvers() {

    const {
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Mutation: {
        ...Mutation,
        exportUsers: (source, args, ctx, info) => {
          return this.getProcessor(ctx).exportUsers(args, info);
        },
      },
    }

  }

}
