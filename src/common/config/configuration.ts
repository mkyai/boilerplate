import { Logger } from '@nestjs/common';
const { NODE_ENV } = process.env;
export default async () => {
  try {
    if (NODE_ENV === 'local') return process.env; // for local development
    // for production
    //TODO: set up key vault
    return process.env;
  } catch (error) {
    new Logger().error('Error in key vault connection=>', error);

    return process.env;
  }
};
