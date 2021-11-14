import * as path from 'https://deno.land/std@0.101.0/path/mod.ts';

export const readRelativeInput = (importUrl, inputFile) => {
  const dirname = path.dirname(path.fromFileUrl(importUrl));
  const filePath = path.join(dirname, 'data', inputFile);
  return Deno.readTextFileSync(filePath);
};
