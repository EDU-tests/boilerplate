
import fs from "fs";

import chalk from "chalk";


import MergeSchema from 'merge-graphql-schemas';

import PrismaModule from "@prisma-cms/prisma-module";


// import LogModule from "@prisma-cms/log-module";
// import UserModule from "@prisma-cms/user-module";
import UserModule from "./user";
// import ResourceModule from "./resource";
// import MailModule from "@prisma-cms/mail-module";
// import UploadModule, {
//   Modules as UploadModules,
// } from "@prisma-cms/upload-module";
// import RouterModule from "@prisma-cms/router-module";
import SocietyModule, {
  Modules as SocietyModules,
} from "@prisma-cms/society-module";
import EthereumModule, {
  Modules as EthereumModules,
} from "@prisma-cms/ethereum-module";
import WebrtcModule from "@prisma-cms/webrtc-module";
import MarketplaceModule from "@prisma-cms/marketplace-module";
// import CooperationModule from "@prisma-cms/cooperation-module";
import CooperationModule from "./cooperation";

import SchoolModule from './edu/School';

import { parse, print } from "graphql";
import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;


class CoreModule extends PrismaModule {


  constructor(options = {}) {

    super(options);

    this.mergeModules([
      CooperationModule,
      // LogModule,
      // MailModule,
      // UploadModule,
      SocietyModule,
      EthereumModule,
      WebrtcModule,
      // // UserModule,
      // RouterModule,
      MarketplaceModule,
      // ResourceModule,
    ]
      .concat(
        EthereumModules,
        SocietyModules,
        // UploadModules,
      )
      .concat([
        UserModule,
      ])
      .concat([
        SchoolModule,
      ])
    );

  }


  getSchema(types = []) {

    let schema = super.getSchema(types);

    // schema = this.cleanupApiSchema(schema, [
    // ]);

    let customSchema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });

    if (customSchema) {
      schema = mergeTypes([schema].concat(customSchema), { all: true });
    }

    return schema;
  }



  getApiSchema(types = []) {

    let baseSchema = [];

    let schemaFile = __dirname + "/../../schema/generated/prisma.graphql";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");

      baseSchema = this.cleanupApiSchema(baseSchema, [
        // "Position",

        // // Cooperation
        // "ProjectCreateInput",
        // "ProjectUpdateInput",
        // "TaskCreateInput",
        // // "TaskUpdateInput",
        // "TimerCreateInput",
        // "TimerUpdateInput",

        // "TaskReactionCreateInput",
        // // "TaskReactionUpdateInput",
        // "TaskCreateOneInput",
        // "TaskUpdateOneInput",

        // "ProjectMemberCreateInput",
        // "ProjectMemberUpdateInput",
        // "ProjectCreateOneWithoutMembersInput",
        // "UserCreateOneWithoutProjectsInput",
        // "ServiceCreateManyWithoutProjectsInput",
        // "ServiceUpdateManyWithoutProjectsInput",

        // "TeamCreateInput",
        // "TeamUpdateInput",
        // "TeamCreateOneWithoutChildsInput",
        // "TeamCreateManyWithoutParentInput",
        // "TeamMemberCreateManyWithoutTeamInput",
        // "ProjectCreateManyWithoutTeamInput",
        // "TeamUpdateOneWithoutChildsInput",
        // "TeamUpdateManyWithoutParentInput",
        // "TeamMemberUpdateManyWithoutTeamInput",
        // "ProjectUpdateManyWithoutTeamInput",

        // "TeamMemberCreateInput",
        // "TeamMemberUpdateInput",
        // "TeamCreateOneWithoutMembersInput",
        // "UserCreateOneWithoutTeamsInput",

        // "PositionCreateInput",
        // "PositionUpdateInput",
        // "UserCreateManyWithoutPositionsInput",
        // "UserUpdateManyWithoutPositionsInput",

        // "ServiceCreateInput",
        // // Eof Cooperation

        // "ResourceCreateInput",
        // "ResourceUpdateInput",
        // "ResourceCreateOneWithoutChildsInput",
        // "ResourceCreateManyWithoutParentInput",
        // "UserUpdateOneWithoutResourcesInput",
        // "ResourceUpdateOneWithoutChildsInput",
        // "ResourceUpdateManyWithoutParentInput",
        // "ResourceUpdateManyWithoutCreatedByInput",
        // "ResourceCreateManyWithoutCreatedByInput",
        // "FileCreateOneWithoutImageResourceInput",
        // "FileUpdateOneWithoutImageResourceInput",

        // "ChatRoomCreateInput",
        // "ChatRoomUpdateInput",
        // "UserCreateManyWithoutRoomsInput",
        // "UserUpdateManyWithoutRoomsInput",
        // // "ChatRoomInvitationUpdateManyWithoutRoomInput",

        // "ChatMessageCreateInput",
        // "ChatMessageUpdateInput",
        // "ChatRoomCreateOneWithoutMessagesInput",

        // "ChatMessageReadedCreateInput",
        // "ChatMessageCreateOneWithoutReadedByInput",

        // // "CallRequestCreateInput",
        // "CallRequestUpdateDataInput",
        // "ChatRoomCreateOneWithoutCallRequestsInput",
        // "ChatRoomUpdateOneWithoutCallRequestsInput",

        // "EthContractSourceCreateInput",
        // "EthContractSourceUpdateInput",
        // "EthTransactionCreateInput",
        // "EthAccountCreateInput",
        // "EthAccountUpdateInput",
        // "EthTransactionSubscriptionPayload",
      ]);

    }
    else {
      console.error(chalk.red(`Schema file ${schemaFile} did not loaded`));
    }


    let apiSchema = super.getApiSchema(types.concat(baseSchema), [

      // "UserCreateInput",
      // "UserUpdateInput",

    ]);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes(schema.concat(apiSchema), { all: true });

    // console.log(chalk.green("apiSchema"), apiSchema);


    /**
     * Фильтруем все резолверы, коих нет в текущем классе
     */
    const resolvers = this.getResolvers();

    const parsed = parse(apiSchema);

    let operations = parsed.definitions.filter(
      n => n.kind === "ObjectTypeDefinition"
        && ["Query", "Mutation", "Subscription"].indexOf(n.name.value) !== -1
      // && !resolvers[n.name.value][]
    );

    operations.map(n => {

      let {
        name: {
          value: operationName,
        },
        fields,
      } = n;

      n.fields = fields.filter(field => {
        // console.log(chalk.green("field"), field);
        return resolvers[operationName][field.name.value] ? true : false;
      });

      return null;
    });

    apiSchema = print(parsed);


    return apiSchema;

  }


  renderApiSchema() {

    let schemaFile = "src/schema/generated/api.graphql";

    let baseSchema = "";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");
    }
    // else {
    //   console.log("file not exists");
    // }

    return baseSchema;
  }


  getResolvers() {


    let resolvers = super.getResolvers();

    // console.log("resolvers", resolvers);

    const {
      Query: {
        letter,
        letters,
        lettersConnection,
        // file,
        files,
        filesConnection,
        logedin,
        logedins,
        logedinsConnection,
        log,
        logs,
        logsConnection,

        resource,
        resources,
        resourcesConnection,

        resourceTag,
        resourceTags,
        resourceTagsConnection,

        vote,
        votes,
        votesConnection,

        tag,
        tags,
        tagsConnection,

        task,
        tasks,
        tasksConnection,

        taskReaction,
        taskReactions,
        taskReactionsConnection,

        timer,
        timers,
        timersConnection,

        notice,
        notices,
        noticesConnection,

        service,
        services,
        servicesConnection,

        team,
        teams,
        teamsConnection,

        teamMember,
        teamMembers,
        teamMembersConnection,

        gallery,
        gallerys,
        gallerysConnection,

        project,
        projects,
        projectsConnection,

        projectMember,
        projectMembers,
        projectMembersConnection,

        position,
        positions,
        positionsConnection,

        ethAccount,
        ethAccounts,
        ethAccountsConnection,

        ethTransaction,
        ethTransactions,
        ethTransactionsConnection,

        ethContract,
        ethContracts,
        ethContractsConnection,

        ethContractSource,
        ethContractSources,
        ethContractSourcesConnection,

        ethPersonalAccount,
        ethPersonalAccounts,
        ethPersonalAccountsConnection,

        ethBlock,
        ethBlocks,
        ethBlocksConnection,


        ethSyncState,
        ethNet,
        ethCoinbase,

        ...Query
      },
      Mutation: {
        createSmsMessageProcessor,
        createSmsProviderProcessor,
        updateSmsProviderProcessor,
        // signin,
        // createUserProcessor,
        resetPasswordProcessor,
        // signup,
        ethSigninOrSignup,
        ethConnectAuthAccount,
        // updateUserProcessor,
        ...Mutation
      },
      User,
      ...other
    } = resolvers;


    // const {
    // } = Mutation;


    let AllowedMutations = {

      ...Mutation,
    };

    // console.log('AllowedMutations', AllowedMutations);

    const rs = {
      ...other,
      Query: {
        ...Query,
        apiSchema: this.renderApiSchema,
        // resource: async (source, args, ctx, info) => {

        //   const {
        //     where,
        //   } = args;

        //   let {
        //     uri,
        //   } = where || {};

        //   /**
        //    * Если указан ури, но не начинается со слеша, то добавляем слеш
        //    */
        //   if (uri && !uri.startsWith("/")) {
        //     where.uri = `/${uri}`;

        //     Object.assign(args, where);
        //   }

        //   return resource(source, args, ctx, info);
        // },
      },
      Mutation: AllowedMutations,
      // Log: {
      //   stack: () => null,
      // },
      // Letter: {
      //   id: () => null,
      //   email: () => null,
      //   subject: () => null,
      //   message: () => null,
      // },

      User: {
        ...User,
        schoolRoles: async (source, args, ctx, info) => {

          // console.log('source', source);
          console.log('source', JSON.stringify(source, true, 2));

          console.log('args', JSON.stringify(args, true, 2));


          const {
            id,
          } = source

          const {
            // currentUser,
            db,
          } = ctx

          const Groups = await db.query.userGroups({
            where: {
              Users_some: {
                id,
              }
            }
          });

          // console.log('Groups', Groups);

          // console.log('Groups.map(n => n.name)', Groups.map(n => n.name));

          return Groups.map(n => n.name);
        },
      },
    };

    // console.log('resolvers', rs);

    return rs;
  }


}


export default CoreModule;