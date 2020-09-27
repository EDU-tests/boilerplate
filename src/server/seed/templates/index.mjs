/* eslint-disable prefer-template */
/* eslint-disable no-path-concat */

import fs from 'fs';

export default async ({
  db,
  seed_dir,
}) => {
  console.log('Template seed');

  // return;

  // const relations = {
  //   Parent: [],
  // }

  const seed = async data => {
    const {
      CreatedBy,
      Project,
      PrismaProject,
      Parent,
      createdAt,
      updatedAt,
      ...createData
    } = data;


    const {
      id,
      ...updateData
    } = createData;

    // if (Parent) {
    //   relations.Parent.push({
    //     where: {
    //       id,
    //     },
    //     data: {
    //       Parent: {
    //         connect: {
    //           id: Parent.id,
    //         },
    //       },
    //     },
    //   });
    // }

    await db.mutation.upsertTemplate({
      // ...other,
      // id,
      // props: props ? JSON.parse(props) : null,
      // components: components ? JSON.parse(components) : null,
      where: {
        id,
      },
      create: createData,
      update: updateData,
    });
  };

  const json = fs.readFileSync(`${seed_dir}templates.json`);

  const objects = JSON.parse(json.toString());

  // console.log('data', JSON.stringify(objects, true, 2));

  await Promise.all(objects.map(seed));


  // console.log('relations.Parent', relations.Parent);

  // if (relations.Parent.length) {

  //   const updateParents = async (n) => {

  //     // console.log('updateParents', n);

  //     return prisma.updateTemplate(n);
  //   }

  //   await Promise.all(relations.Parent.map(updateParents));
  // }

};
