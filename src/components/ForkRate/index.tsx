import * as React from "react";
import * as echarts from "echarts/core";
import {
  BarChart,
  LineChart,
  LineSeriesOption,
  BarSeriesOption,
} from "echarts/charts";
import BigCard from "components/BigCard";
import styles from "./styles.module.scss";
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
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
  LineChart,
  LegendComponent,
  CanvasRenderer,
]);

type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | TooltipComponentOption
  | LineSeriesOption
  | LegendComponentOption
>;

interface RenderProp {
  shards: ShardSummary[];
}

export default class ForkRate extends React.Component<RenderProp, {}> {
  chart: any;
  chartBoxRef = React.createRef<HTMLDivElement>();

  UNSAFE_componentWillReceiveProps(nextProps: RenderProp) {
    if (nextProps.shards && nextProps.shards.length > 0) {
      this.updateChart(nextProps.shards);
    }
  }

  getOption(shards: ShardSummary[]): ECOption {
    const xAxisData: string[] = [];
    const tpsSeriesData: number[] = [];
    const forkrateSeriesData: number[] = [];
    const names = ["Throughput(TPS)", "Fork Rate"];
    const colors = ["rgba(148, 24, 227, 1)", "rgba(30, 176, 252, 1)"];
    shards.forEach((shard, idx) => {
      xAxisData.push("Zone " + (idx + 1));
      tpsSeriesData.push(shard.Throughtput);
      forkrateSeriesData.push(shard.ForkRate);
    });

    return {
      grid: {
        bottom: "10%",
        left: "20%",
        tooltip: {
          trigger: "axis",
        },
      },
      legend: {
        data: [
          {
            name: names[0],
            textStyle: {
              color: colors[0],
            },
          },
          {
            name: names[1],
            textStyle: {
              color: colors[1],
            },
          },
        ],
        textStyle: {
          fontFamily: "gilroy-medium",
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
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          position: "left",
          boundaryGap: [0, "3%"],
          axisLabel: {
            formatter: function (value: number) {
              return value / 10000 + " 万";
            },
          },
        },
        {
          type: "value",
          position: "right",
          axisLine: {
            show: false,
          },
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
              return value + "%";
            },
          },
        },
      ],
      series: [
        {
          data: tpsSeriesData,
          name: names[0],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(255, 255, 255, 0.2)",
            borderRadius: [10, 10, 10, 10],
          },
          itemStyle: {
            color: colors[0],
            borderRadius: [10, 10, 10, 10],
          },
          barMaxWidth: 10,
        },
        {
          data: forkrateSeriesData,
          yAxisIndex: 1,
          name: names[1],
          type: "line",
          itemStyle: {
            color: colors[1],
          },
        },
      ],
    };
  }

  updateChart(shards: ShardSummary[]) {
    console.log("update chart forkrate");
    this.chart.setOption(this.getOption(shards));
  }

  makeChart = () => {
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
      <BigCard showTitle={false} classname={styles.box} title="">
        <div
          ref={this.chartBoxRef}
          style={{ width: "100%", height: "100%" }}
        ></div>
      </BigCard>
    );
  }
}
