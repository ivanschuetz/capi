// dao name, dao descr, social media, versions, image nft url, prospectus url, prospectus hash, team url
export const GLOBAL_SCHEMA_NUM_BYTE_SLICES = 8;
// total received, shares asset id, funds asset id, share price, investors part, shares locked, funds target, funds target date,
// raised, image nft asset id, setup date, min invest shares, max invest shares
export const GLOBAL_SCHEMA_NUM_INTS = 14;

export const LOCAL_SCHEMA_NUM_BYTE_SLICES = 3; // signed prospectus url, signed prospectus hash, signed prospectus timestamp
export const LOCAL_SCHEMA_NUM_INTS = 3; // for investors: "shares", "claimed total", "claimed init"
