import { Api, ApiError, ErrCallback, Reply } from './types';

export function filterObject(obj: { [key: string]: any }): {
  [key: string]: any;
} {
  const filteredObj: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!value) {
      if (typeof value === 'number' && value !== 0) {
        continue;
      }
    }
    if (typeof value === 'string' && value.trim() === '') {
      continue;
    }
    filteredObj[key] = value;
  }
  return filteredObj;
}

export const errCallback: ErrCallback = (
  err: ApiError,
  api: Api,
  reply: Reply
) => {
  api.log.error(err.message);
  if (err.message.includes('Unique')) {
    return reply.status(400).send({
      title: 'Something went wrong',
      details: 'Trying to save an existing unique key',
    });
  }
  reply.status(err.status || 500).send({
    title: 'Something went wrong',
    details: err.message,
  });
};
