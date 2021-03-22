// tslint:disable
export default class ChartColumn {
  constructor(d = {}) {
    const me = this;
    me.d = d;
    d.gd = d.canvas.getContext("2d");

    d.conf = d.conf || {};
    d.conf.mode = d.conf.mode || "step-1";
    d.conf.space = d.conf.space || 0.25;

    d.layout = {
      title: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
      yAxis: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        listScale: (() => {
          switch (d.conf.mode) {
            case "step-1":
              return Array(5)
                .fill()
                .map((_, idx, arr) => {
                  const scale = idx / (arr.length - 1);
                  return {
                    name: scale ? scale * 100 + "%" : 0,
                  };
                });
            case "step-2":
              return Array(2)
                .fill()
                .map((_, idx, arr) => {
                  return {
                    name:
                      ((arr.length - idx) / arr.length) * 100 * d.max[1] + "%",
                  };
                })
                .concat(
                  Array(5)
                    .fill()
                    .map((_, idx, arr) => {
                      const scale = idx / (arr.length - 1);
                      return {
                        name: scale
                          ? Number((scale * d.max[0]).toFixed(2)) + "TPS"
                          : 0,
                      };
                    })
                );
            default:
          }
        })(),
      },
      xAxis: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        listScale: Array(d.series.length)
          .fill()
          .map((_, idx, arr) => {
            return {
              name: "Zone-" + (idx + 1),
            };
          }),
      },
      main: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
    };

    me.initData();
    me.initEvents();
  }
  initData() {
    const me = this;
    const d = me.d;
    const { gd } = d;

    gd.font = "14px Arial";
    d.title.texts.forEach((v) => {
      v.width = gd.measureText(v.text).width + 50;
    });
  }
  initEvents() {
    const me = this;
    const d = me.d;
    const { canvas } = d;

    me.handleWindowResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      me.setLayout();
      me.render();
    };
    me.handleWindowResize();
    window.addEventListener("resize", me.handleWindowResize, false);
  }
  setLayout() {
    const me = this;
    const d = me.d;
    const { canvas, gd } = d;
    const { title, yAxis, main, xAxis } = d.layout;

    gd.font = "12px Arial";

    title.x = 0;
    title.y = 0;
    title.w = canvas.offsetWidth;
    title.h = 50;

    xAxis.h = 30;

    yAxis.x = 0;
    yAxis.y = title.y + title.h;
    yAxis.w = Math.max(
      ...yAxis.listScale.map((v) => {
        return Math.ceil(gd.measureText(v.name).width + 20);
      })
    );
    yAxis.h = canvas.offsetHeight - title.h - xAxis.h;

    main.x = yAxis.x + yAxis.w;
    main.y = title.y + title.h;
    main.w = canvas.offsetWidth - yAxis.w - 10;
    main.h = yAxis.h;

    xAxis.x = yAxis.w;
    xAxis.y = canvas.offsetHeight - xAxis.h;
    xAxis.w = main.w;
  }
  render() {
    const me = this;
    const d = me.d;
    const { gd } = d;

    gd.font = "14px Arial";
    gd.textAlign = "left";
    gd.textBaseline = "top";

    const renderTitleText = () => {
      const textWidth =
        d.title.texts.reduce((total, v) => {
          return (total += v.width);
        }, 0) - 50;
      let iLeft = d.layout.title.w / 2 - textWidth / 2 + 10;

      d.title.texts.forEach((v, stepIdx, arr) => {
        gd.beginPath();
        gd.font = "14px Arial";
        gd.textAlign = "left";
        gd.textBaseline = "middle";
        gd.fillStyle = "#666";

        gd.fillText(v.text, iLeft, d.layout.title.y + d.layout.title.h / 2);

        {
          const x = iLeft - 12;
          const y = d.layout.title.y + d.layout.title.h / 2;

          gd.arc(x, y, 6, 0, 2 * Math.PI);
          gd.fillStyle = d.fillStyle[stepIdx];
          gd.fill();
        }

        iLeft += v.width;
      });
    };

    const renderYAxis = () => {
      const step = d.layout.yAxis.h / (d.layout.yAxis.listScale.length - 1);

      d.layout.yAxis.listScale.forEach((v, idx, arr) => {
        {
          const x1 = parseInt(d.layout.yAxis.w) + 0.5;
          const y1 =
            parseInt((arr.length - idx - 1) * step + d.layout.yAxis.y) + 0.5;
          const x2 = parseInt(x1 + d.layout.main.w) + 0.5;
          const y2 = y1;

          gd.beginPath();
          gd.lineTo(x1, y1);
          gd.lineTo(x2, y2);
          gd.strokeStyle = "rgba(128,128,128,.3)";
          gd.stroke();
        }

        {
          const x = 0;
          const y = (arr.length - idx - 1) * step + d.layout.yAxis.y;

          gd.font = "12px Arial";
          gd.textAlign = "right";
          gd.textBaseline = "middle";
          gd.fillStyle = "#999";
          gd.fillText(v.name, x + d.layout.yAxis.w - 10, y);
        }
      });
    };

    const renderMain = () => {
      const perW = d.layout.main.w / d.series.length;
      const space = perW * d.conf.space;

      d.series.forEach((v, idx) => {
        v.data.forEach((n, stepIdx, arr) => {
          const scale = n / d.max[stepIdx];
          const w = perW - space - (stepIdx / arr.length) * (perW - space);
          let h = scale * d.layout.main.h;
          let x = idx * perW + (perW - w) / 2 + d.layout.main.x;
          let y = d.layout.main.y + d.layout.main.h - h;

          if (d.conf.mode === "step-2") {
            switch (stepIdx) {
              case 0:
                {
                  const dh = (d.layout.yAxis.h / 3) * 2;
                  h = scale * dh;
                  x = idx * perW + (perW - w) / 2 + d.layout.main.x;
                  y = d.layout.main.y + dh - h;
                }
                break;
              case 1:
                {
                  const dh = d.layout.yAxis.h / 3;
                  h = scale * dh;
                  x = idx * perW + (perW - w) / 2 + d.layout.main.x;
                  y = d.layout.main.y + d.layout.main.h - dh;
                }
                break;
              default:
            }
          }

          gd.beginPath();
          gd.rect(x, y, w, h);
          gd.fillStyle = d.fillStyle[stepIdx];
          gd.fill();
        });
      });
    };

    const renderXAxis = () => {
      const step = d.layout.xAxis.w / d.series.length;

      gd.font = "12px Arial";
      gd.textAlign = "center";
      gd.textBaseline = "middle";

      d.series.forEach((v, idx, arr) => {
        const x = idx * step + step / 2 + d.layout.yAxis.w;
        const y = d.layout.xAxis.y + d.layout.xAxis.h / 2;
        gd.fillText("Zone-" + idx, x, y);
      });
    };

    gd.save();
    renderTitleText();
    renderYAxis();
    renderXAxis();
    renderMain();
    gd.restore();
  }
  destroy() {
    const me = this;
    window.removeEventListener("resize", me.handleWindowResize, false);
  }
}

// tslint:enable
