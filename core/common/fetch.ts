export const fetchJson = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

export const fetchBlob = async (url: string) => {
  const response = await fetch(url);
  return await response.blob();
};
