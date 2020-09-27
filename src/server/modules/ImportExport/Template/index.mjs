
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";
import fs from 'fs';


export class TemplateProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "Template";
  }


  async exportTemplates() {

    const {
      db,
    } = this.ctx;

    let result = false;

    const templates = await db.query.templates({
      // first: 1,
      orderBy: "createdAt_ASC",
    }, `
      {
        id
        externalKey
        name
        description
        component
        props
        components
        vars
        rank
        Parent {
          id
        }
      }
    `);

    fs.writeFileSync('src/server/seed/data/templates.json', JSON.stringify(templates, true, 2), {
      flag: "w+",
    });

    result = true;

    return result;
  }
}


export default class TemplateModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return TemplateProcessor;
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
        exportTemplates: (source, args, ctx, info) => {
          return this.getProcessor(ctx).exportTemplates(args, info);
        },
      },
    }

  }

}
