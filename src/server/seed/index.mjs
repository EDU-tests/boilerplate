
import seedUsers from './users';
import seedTemplates from './templates';

import path from 'path';
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

export default async ({
  db,
}) => {

  const {
    API_SEED_USERS,
    API_SEED_TEMPLATES,
  } = process.env;

  // console.log('API_SEED_TEMPLATES', API_SEED_TEMPLATES);


  if (API_SEED_USERS !== "true") {
    console.warn("API_SEED_USERS is false. Skip seeding users.");
  }
  else {
    await seedUsers({
      db,
      seed_dir: `${__dirname}/data/`,
    });
  }


  if (API_SEED_TEMPLATES !== "true") {
    console.warn("API_SEED_TEMPLATES is false. Skip seeding templates.");
  }
  else {
    await seedTemplates({
      db,
      seed_dir: `${__dirname}/data/`,
    });
  }

}
