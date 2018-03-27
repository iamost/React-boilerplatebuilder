import moment from 'moment';

export const epochToString = function (sec, format) {
  return moment(sec).format(format);
};