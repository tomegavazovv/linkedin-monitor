function convertDateToHours(date) {
  let hours = 500;
  if (date.includes('s')) hours = 1 / 60;
  else if (date.includes('m') && !date.includes('mo'))
    hours = date.split('m')[0] / 60;
  else if (date.includes('h')) hours = date.split('h')[0];
  else if (date.includes('d')) hours = date.split('d')[0] * 24;
  return hours;
}

exports.convertDateToHours = convertDateToHours;
