import { Web3Storage } from "web3.storage";

export const storeIpfs = async (bytes) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ3ZjgwZkJlNTg4Njc1MUYyYjdiOWFmMzc0ODZFZDIyMUViYjM5QWYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY3NzIzMjA2MDUsIm5hbWUiOiJjYXAifQ.OhJ_FMoew_9QrHIl7Wjkw4JYI3qzKw1Mff8h8saSHIw";

  const storage = new Web3Storage({ token });

  //   var bytes = new Uint8Array(bytesArr);

  const fileName = "file";

  const blob = new Blob([bytes]);
  const file = new File([blob], fileName);

  const cid = await storage.put([file]);
  console.log("Content added with CID:", cid);

  return "https://ipfs.io/ipfs/" + cid + "/" + fileName;
  //   const files = [];

  //   for (const path of args._) {
  //     const pathFiles = await getFilesFromPath(path);
  //     files.push(...pathFiles);
  //   }

  //   console.log(`Uploading ${files.length} files`);
  //   const cid = await storage.put(files);
  //   console.log("Content added with CID:", cid);
};

// if bytes is set, stores them in ipfs and returns ipfs url (gateway),
// if not set doesn't do anything and returns null
export const toMaybeIpfsUrl = async (bytes) => {
  if (bytes && bytes.byteLength > 0) {
    return await storeIpfs(bytes);
  } else {
    return null;
  }
};
