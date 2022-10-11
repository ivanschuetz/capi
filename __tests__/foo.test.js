var cp = require("child_process");

const scriptsDir = ".scripts";

// jest.setTimeout(100000);
// jest.useRealTimers();

test("script", (done) => {
  resetSandbox(() =>
    foundAccounts(() => {
      console.log("finish!");
      done();
    })
  );
}, 200000);

const resetSandbox = (onDone) => {
  const script = cp.exec(`${scriptsDir}/sandbox_dev_reset.sh`);
  script.stdout.on("data", (data) => {
    // console.log("stdout: " + data);
    if (isResetFinished(data)) {
      console.log("Sandbox reset finished!");
      onDone();
    }
  });
  script.stderr.on("data", (data) => {
    // console.error("stderr: " + data);
  });
};

const foundAccounts = (onDone) => {
  console.log("Will call fund accounts script..");
  const script = cp.exec(`${scriptsDir}/fund_accounts_sandbox.sh`);
  script.stdout.on("data", (data) => {
    console.log("stdout: " + data);
    if (isFundFinished(data)) {
      onDone();
    }
  });
  script.stderr.on("data", (data) => {
    console.error("stderr: " + data);
  });
};

const isResetFinished = (data) => {
  // this is a string that appears in the last log message
  // don't know how to make the test stop (successfully) otherwise
  if (
    data.includes(
      `Soon after sending the transaction it will appear in indexer`
    )
  ) {
    console.log("found the last log message (reset)!");
    return true;
  }
  return false;
};

const isFundFinished = (data) => {
  if (data.includes(`done!`)) {
    console.log("found the last log message (funding)!");
    return true;
  }
  return false;
};
