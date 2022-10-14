import { Algodv2 } from "algosdk";

export const makeAlgod = () => {
  return algodForEnv(Env.SandboxPrivate);
};

export const algodForEnv = (env: Env) => {
  switch (env) {
    case Env.SandboxPrivate:
      return sandboxPrivateAlgod();
  }
};

enum Env {
  SandboxPrivate = "SandboxPrivate",
}

const sandboxPrivateAlgod = () => {
  const token =
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const server = "http://127.0.0.1";
  const port = 4001;
  return new Algodv2(token, server, port);
};
