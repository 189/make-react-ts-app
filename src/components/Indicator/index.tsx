import * as React from "react";
import Card from "components/Card";
// import ChainStore from "store";
import { ShardSummary } from "service/chain";
import { graceByte } from "utils/help";
import styles from "./styles.module.scss";

interface Props {
  shards: ShardSummary[];
}

export default class Indicator extends React.PureComponent<Props, {}> {
  // chain = ChainStore;

  get shards() {
    return this.props.shards || [];
  }

  get capacity() {
    const cap = this.shards.reduce((prev, shard) => {
      if (shard.StateSize) {
        return prev + shard.StateSize;
      }
      return prev;
    }, 0);
    return graceByte(cap);
  }

  get mempool() {
    return this.shards.reduce((prev, shard) => {
      if (shard.detail.State) {
        return prev + shard.detail.State.PendingTxn;
      }
      return prev;
    }, 0);
  }

  get forkRate() {
    return this.shards.reduce((prev, shard) => {
      return prev + shard.detail.Forkrate;
    }, 0);
  }

  get throughput() {
    const tps = this.shards.reduce((prev, shard) => {
      return prev + shard.detail.Throughput;
    }, 0);
    return tps.toFixed(2);
  }

  render() {
    return (
      <div className={styles.indicator}>
        <Card
          classname={styles.item}
          imageSrc={require("assets/images/tps.png").default}
          title="Throughput"
          value={this.throughput}
        />
        <Card
          classname={styles.item}
          imageSrc={require("assets/images/forkrate.png").default}
          title="Fork Rate"
          value={this.forkRate}
        />
        <Card
          classname={styles.item}
          imageSrc={require("assets/images/capacity.png").default}
          title="Capacity"
          value={this.capacity.value + this.capacity.unit}
        />
        <Card
          classname={styles.item}
          imageSrc={require("assets/images/mempool.png").default}
          title="Mempool"
          value={this.mempool}
        />
      </div>
    );
  }
}
