import * as React from "react";

import cn from "classnames";
import styles from "./styles.module.scss";
import { format } from "utils/help";

interface Props {
  classname?: string;
  onTimeEnd?: () => void;
}

interface State {
  time: number;
  day: number;
  tick: number;
}

const MAX = 30;
export default class Middle extends React.PureComponent<Props, State> {
  timer: any;

  state: State = {
    time: Date.now(),
    day: new Date().getDay(),
    tick: MAX,
  };

  couter = () => {};

  componentDidMount() {
    this.timer = setInterval(() => {
      const now = Date.now();
      this.setState(
        {
          time: now,
          day: new Date().getDay(),
          tick: this.state.tick - 1 <= 0 ? MAX : this.state.tick - 1,
        },
        () => {
          if (this.state.tick === MAX) {
            this.props?.onTimeEnd?.();
          }
        }
      );
    }, 1000);
  }

  getWeekDay(): string {
    return [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ][this.state.day];
  }

  render() {
    const { time: now, tick } = this.state;
    return (
      <section className={cn(styles.middlebox, this.props.classname)}>
        <div className={styles.clock}>
          <h4 className="ui-font-medium">{format(now, "HH:mm:ss")}</h4>
          <span>
            {format(now, "YYYY年MM月DD日")} {this.getWeekDay()}
          </span>
        </div>
        <div className={cn([styles.earth, "ui-center"])}>
          <section className="ui-font-bold">
            <label>Auto Refresh Page After:</label>
            <p className="ui-font-bold">
              {tick}
              <span>s</span>
            </p>
          </section>
        </div>
        <div className={styles.bottom}></div>
      </section>
    );
  }
}
