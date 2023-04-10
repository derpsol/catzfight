export const getDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let number =
    year * Math.pow(10, 10) +
    month * Math.pow(10, 8) +
    day * Math.pow(10, 6) +
    hour * Math.pow(10, 4) +
    minute * Math.pow(10, 2) +
    second;
  return number;
};
