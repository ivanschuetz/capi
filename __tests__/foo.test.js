import algosdk from "algosdk";

test("transaction params", async () => {
  const token =
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const server = "http://127.0.0.1";
  const port = 4001;
  const client = new algosdk.Algodv2(token, server, port);

  const params = await client.getTransactionParams().do();

  console.log("params: %o", params);
  expect(params.firstRound).toBeGreaterThan(0);
});
