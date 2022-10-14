import { Algodv2 } from "algosdk";

export const makeAlgod = () => {
  const server = process.env.NEXT_PUBLIC_ALGOD_SERVER;
  const port = process.env.NEXT_PUBLIC_ALGOD_PORT;
  const token = process.env.NEXT_PUBLIC_ALGOD_TOKEN;

  console.log(
    "Instantiating algod with server: %o, port: %o, token: %o",
    server,
    port,
    token
  );

  // third parties don't expect a token (and default port).
  // The SDK expects empty string if not set.
  return new Algodv2(token ?? "", server, port ?? "");
};
