import { action, computed, observable, runInAction } from "mobx";
import { ShardSummary, Summary, HubRes } from "service/chain";
import { graceByte } from "utils/help";

class Chain {
  @observable
  hub: Partial<HubRes> = {};

  @observable
  time: number = 0;

  constructor() {
    this.doUpdateHub();
  }

  @computed get shards(): ShardSummary[] {
    return this.hub.Shards || [];
  }

  @computed get capacity() {
    const cap = this.shards.reduce((prev, shard) => {
      if (shard.StateSize) {
        return prev + shard.StateSize;
      }
      return prev;
    }, 0);
    return graceByte(cap);
  }

  @computed get mempool() {
    return this.shards.reduce((prev, shard) => {
      if (shard.detail.State) {
        return prev + shard.detail.State.PendingTxn;
      }
      return prev;
    }, 0);
  }

  @computed get forkRate() {
    return this.shards.reduce((prev, shard) => {
      return prev + shard.detail.Forkrate;
    }, 0);
  }

  @computed get throughput() {
    const tps = this.shards.reduce((prev, shard) => {
      return prev + shard.detail.Throughput;
    }, 0);
    return tps.toFixed(2);
  }

  @action
  doUpdateHub = () => {
    Summary().then((response) => {
      runInAction(() => {
        this.hub = response;
        this.time = Date.now();
        console.log(this);
      });
    });
  };
}

export default new Chain();
