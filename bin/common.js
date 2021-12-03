export const runCommand = async (args) => {
  const process = Deno.run({
    cmd: args,
  });
  const status = await process.status();
  process.close();
  return status.code;
};
