/* eslint-disable prefer-template */
/* eslint-disable no-path-concat */

import fs from 'fs';

export default async ({
  db,
  seed_dir,
}) => {
  console.log('Users seed');

  const seed = async data => {
    const {
      createdAt,
      updatedAt,
      ...createData
    } = data;

    const {
      id,
      ...updateData
    } = createData;

    await db.mutation.upsertTemplate({
      where: {
        id,
      },
      create: createData,
      update: updateData,
    });
  };

  const json = fs.readFileSync(`${seed_dir}templates.json`);

  const objects = JSON.parse(json.toString());

  await Promise.all(objects.map(seed));

};
