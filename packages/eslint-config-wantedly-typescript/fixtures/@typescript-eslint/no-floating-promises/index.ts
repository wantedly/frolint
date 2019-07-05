const _a = async () => {
  const promise = new Promise((resolve, _reject) => resolve("value"));
  await promise;
};

async function returnsPromise() {
  return "value";
}
returnsPromise().then(() => {}, () => {});

Promise.reject("value").catch(() => {});
