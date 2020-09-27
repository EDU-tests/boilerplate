
import PrismaModule from "@prisma-cms/prisma-module";

import ExportTemplateModule from './Template';

export default class ImportExportModule extends PrismaModule {

  constructor(props) {

    super(props);

    this.mergeModules([
      ExportTemplateModule,
    ]);

  }

}