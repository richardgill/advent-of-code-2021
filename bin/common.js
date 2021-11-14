export const runCommand = async (args) => {
  const process = Deno.run({
    cmd: args,
  });
  await process.status();
  process.close();
};
