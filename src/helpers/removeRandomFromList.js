exports.removeRandomFromList = (list) => {
  if (list.length === 0) return null;
  const min = 0;
  const max = list.length;
  const itemIndex = Math.random() * (max - min) + min;
  const [item] = list.splice(itemIndex, 1);
  return item;
};
