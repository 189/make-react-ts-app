const getFontSize = (s: string = "") => {
  return Number(s.replace("px", ""));
};

const correctPx = () => {
  const docEl = document.documentElement;
  const div = document.createElement("div");
  const rootSize = getFontSize(docEl.style.fontSize);
  div.style.width = "8.625rem";
  div.style.height = "0px";
  div.style.flex = "0 0 auto";
  document.body.appendChild(div);
  const rmd = div.clientWidth / rootSize / 8.625;
  document.body.removeChild(div);
  // 误差超过一定值时，视为用户有调整过手机设置
  if (rmd > 1.05 || rmd < 0.95) {
    docEl.style.fontSize = rootSize / rmd + "px";
  }
};

export default (uiWidth = 1920) => {
  const baseFontSize = 100;
  if (/(iPhone\sOS)\s([\d_]+)/.test(navigator.userAgent)) {
    document.documentElement.style.fontSize = `${
      (document.documentElement.clientWidth / uiWidth) * baseFontSize
    }px`;
  } else {
    document.documentElement.style.fontSize = `${
      (window.innerWidth / uiWidth) * baseFontSize
    }px`;
    correctPx();
  }
};
