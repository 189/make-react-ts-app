import * as React from "react";
import * as echarts from "echarts/core";
import { BarChart, BarSeriesOption } from "echarts/charts";
import BigCard from "components/BigCard";
import styles from "./styles.module.scss";
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { ShardSummary } from "service/chain";
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | TooltipComponentOption
>;

interface RenderProp {
  shards: ShardSummary[];
}

export default class HeightChart extends React.Component<RenderProp, {}> {
  chart: any;
  chartBoxRef = React.createRef<HTMLDivElement>();

  UNSAFE_componentWillReceiveProps(nextProps: RenderProp) {
    if (nextProps.shards.length !== this.props.shards.length) {
      this.updateChart(nextProps.shards);
    }
  }

  getOption(shards: ShardSummary[]): ECOption {
    const xAxisData: string[] = [];
    const seriesData: number[] = [];

    shards.forEach((shard, idx) => {
      xAxisData.push("Zone " + (idx + 1));
      seriesData.push(shard.detail.ArchivedHeight);
    });

    return {
      grid: {
        bottom: "10%",
        left: "20%",
        tooltip: {
          trigger: "axis",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: true,
          lineStyle: {
            color: ["rgba(242, 242, 242, 1)"],
            width: 1,
            opacity: 0.1,
          },
        },
        boundaryGap: [0, "3%"],
        axisLabel: {
          formatter: function (value: number) {
            return value / 10000 + "万";
          },
        },
      },
      series: [
        {
          data: seriesData,
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(255, 255, 255, 0.2)",
            borderRadius: [10, 10, 10, 10],
          },
          itemStyle: {
            color: "rgba(30, 176, 252, 1)",
            borderRadius: [10, 10, 10, 10],
          },
          barMaxWidth: 10,
        },
      ],
    };
  }

  updateChart(shards: ShardSummary[]) {
    this.chart.setOption(this.getOption(shards));
  }

  makeChart = () => {
    // const div = document.createElement("div");
    // const size = document.querySelector("html")?.style.fontSize.replace("px", "") as string;
    // const fontSize: number = parseInt(size, 10) || 16;
    // div.style.height = 3.8 * fontSize + "px";
    // div.style.width = 4.5 * fontSize + "px";
    // div.id = "block-height-chart";
    // this.chartBoxRef.current?.appendChild(div);
    // this.chart = echarts.init(div as HTMLDivElement);
    this.chart = echarts.init(this.chartBoxRef.current as HTMLDivElement);
    this.chart.setOption(this.getOption(this.props.shards));
  };

  componentDidMount() {
    setTimeout(() => {
      this.makeChart();
    }, 0);
  }

  render() {
    return (
      <BigCard showTitle={true} classname={styles.box} title="Height">
        <div
          ref={this.chartBoxRef}
          style={{ width: "100%", height: "100%" }}
        ></div>
      </BigCard>
    );
  }
}
