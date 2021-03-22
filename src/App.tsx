import * as React from "react";
import resize from "utils/resizer";
import PrimaryHeader from "components/PrimaryHeader";
import Indicator from "components/Indicator";
import Middle from "components/Middle";
import RecentBlock from "components/RecentBlock";
import { Summary } from "service/chain";

import "./App.scss";
import "./style.module.scss";
import ForkRate from "components/ForkRate";
import HeightChart from "components/HeigthChart";
// import chain from "store"

interface State {
  hub: any;
}

export default class App extends React.Component<{}, State> {
  state: State = {
    hub: {},
  };

  componentDidMount() {
    resize(1920);
    window.addEventListener("resize", this.resizeHandle, false);
    this.fetchChainData();
  }

  fetchChainData = () => {
    Summary().then((response) => {
      this.setState({
        hub: response,
      });
    });
  };

  resizeHandle() {
    resize(1920);
  }

  onTimeEnd = () => {
    this.fetchChainData();
  };

  render() {
    const {
      hub: { Shards: shards = [] },
    } = this.state;

    return (
      <div className="main">
        <PrimaryHeader />
        <div className="parts">
          <section className="part">
            <Indicator shards={shards} />
            <RecentBlock shards={shards} />
          </section>
          <Middle onTimeEnd={this.onTimeEnd} classname="part mid" />
          <section className="part">
            <ForkRate shards={shards} />
            <HeightChart shards={shards} />
          </section>
        </div>
      </div>
    );
  }
}
