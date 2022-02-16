export const sortBy = (key) => {
  return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
};

const orderBy = (array, key) => {
  return array.concat().sort(sortBy(key));
}

export default orderBy;
