import * as merge from 'merge-deep';

export function mergeDeep(target, sources): any {
  return merge(target, sources);
}
