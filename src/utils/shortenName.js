export const shortenName = name => {
  return name.length >= 20 ? `${name.slice(0, 16)}...` : `${name}`;
};
