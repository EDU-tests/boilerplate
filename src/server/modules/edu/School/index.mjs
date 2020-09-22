
import PrismaModule from '@prisma-cms/prisma-module'
import PrismaProcessor from '@prisma-cms/prisma-processor'


export class SchoolProcessor extends PrismaProcessor {
  constructor(props) {
    super(props)

    this.objectType = 'School'
  }


  async create(method, args, info) {
    if (args.data) {
      const {
        ...data
      } = args.data

      args.data = data
    }

    return super.create(method, args, info)
  }


  async update(method, args, info) {
    if (args.data) {
      const {
        ...data
      } = args.data

      args.data = data
    }

    return super.update(method, args, info)
  }


  async mutate(method, args, info) {
    if (args.data) {
      const {
        ...data
      } = args.data

      args.data = data
    }

    return super.mutate(method, args)
  }



  async delete(method, args, info) {
    return super.delete(method, args)
  }
}


export default class SchoolModule extends PrismaModule {
  constructor(props = {}) {
    super(props)

    this.mergeModules([
    ])
  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx)
  }


  getProcessorClass() {
    return SchoolProcessor
  }


  getResolvers() {
    const {
      Query: {
        ...Query
      },
      Subscription: {
        ...Subscription
      },
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers()

    return {
      ...other,
      Query: {
        ...Query,
        school: (source, args, ctx, info) => {
          return ctx.db.query.school(args, info)
        },
        // schools: async (source, args, ctx, info) => {

        //   // return [];
        //   const result = (await ctx.db.query.schools(args, info));

        //   console.log('result', JSON.stringify(result, true, 2));

        //   return result;
        // },
        schools: async (source, args, ctx, info) => {

          const {
            where: baseWhere,
            ...other
          } = args

          const {
            db,
            currentUser,
          } = ctx

          if (!currentUser) {
            return [];
          }

          const {
            id,
          } = currentUser

          const Groups = (await db.query.userGroups({
            where: {
              Users_some: {
                id,
              }
            }
          })).map(n => n.name);

          console.log('Groups', Groups);

          // console.log('Groups.map(n => n.name)', Groups.map(n => n.name));


          // return Groups.map(n => n.name);

          const where = {}

          if (Groups.indexOf('Teachers') === -1) {
            where.Users_some = {
              id: currentUser.id,
            }
          }

          return ctx.db.query.schools({
            ...other,
            where: {
              ...baseWhere,
              ...where,
            },
          }, info)
        },
        schoolsConnection: (source, args, ctx, info) => {
          return ctx.db.query.schoolsConnection(args, info)
        },
      },
      Mutation: {
        ...Mutation,
        // createSchoolProcessor: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).createWithResponse('School', args, info)
        // },
        // updateSchoolProcessor: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).updateWithResponse('School', args, info)
        // },
        createSchool: (source, args, ctx, info) => {
          return ctx.db.mutation.createSchool(args, info)
        },
        updateSchool: (source, args, ctx, info) => {
          return ctx.db.mutation.updateSchool(args, info)
        },
        deleteSchool: (source, args, ctx, info) => {
          return ctx.db.mutation.deleteSchool(args, info)
        },
      },
      // Subscription: {
      //   ...Subscription,
      //   school: {
      //     subscribe: async (parent, args, ctx, info) => {
      //       return ctx.db.subscription.school({}, info)
      //     },
      //   },
      // },
      School: {
        test: (source, args, ctx, info) => {
          
          return "Sdfdsfsdfsdf test";
        },
        test2: (source, args, ctx, info) => {
          
          return "Sdfdsfsdfsdf test 2";
        },
      },
      // SchoolResponse: {
      //   data: (source, args, ctx, info) => {
      //     const {
      //       id,
      //     } = source.data || {}

      //     return id ? ctx.db.query.school({
      //       where: {
      //         id,
      //       },
      //     }, info) : null
      //   },
      // },
    }
  }
}
