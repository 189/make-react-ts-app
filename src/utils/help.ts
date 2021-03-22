export const fixed = function (str: number, n = 0) {
  return Number(str).toFixed(n);
};

export const padStart = function (num: string | number, len = 2, ch = "0") {
  let output = `${num}`;
  while (output.length < len) {
    output = `${ch}${output}`;
  }
  return output;
};

export const graceByte = function (byte: number) {
  const kb = 1024,
    mb = kb * 1024,
    gb = mb * 1024;
  if (byte < kb * 100) {
    return { value: fixed(byte / kb, 3), unit: "KB" };
  }
  if (byte < mb * 100) {
    return { value: fixed(byte / mb, 3), unit: "MB" };
  }
  return { value: fixed(byte / gb, 3), unit: "GB" };
};

export const ellipsis = (str: string, keep: number = 5) => {
  str = str.toString();
  if (str.length < keep * 2) {
    return str;
  }
  return str.slice(0, keep) + "..." + str.slice(Number("-" + keep));
};

export const format = function (time: number, formatStr = "YYYY-MM-DD") {
  const d = new Date(time);
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return formatStr
    .replace("YYYY", d.getFullYear().toString())
    .replace("MM", padStart(d.getMonth() + 1))
    .replace("DD", padStart(d.getDate()))
    .replace("HH", padStart(d.getHours()))
    .replace("mm", padStart(d.getMinutes()))
    .replace("ss", padStart(d.getSeconds()))
    .replace("a", padStart(ampm));
};
