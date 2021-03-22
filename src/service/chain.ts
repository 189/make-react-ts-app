import webapi from "./webapi";

export interface ShardSummary {
  AddressCount: number;
  BlockInterval: number;
  FinalityDistance: number;
  ForkRate: number;
  HashRate: number;
  HeadOutWeight: number;
  Height: number;
  MempoolSize: number;
  SnapshotUpdated: number;
  StateSize: number;
  Throughtput: number;
  Timestamp: number;
  detail: ShardDetail;
}

export interface HubRes {
  DedupSize: number;
  DeployName: string;
  ScalingUp: boolean;
  ShardOnDuty: number;
  ShardOrder: number;
  Time: number;
  Shards: ShardSummary[];
}

export interface ShardDetail {
  ArchivedHeight: number;
  BaseHeight: number;
  BlockId: [number, number];
  BlockIdJam: number;
  BlockInMem: number;
  BlockInterval: number;
  CommittedHeadBlock: [string, number];
  DetachedBranches: number;
  FinalityDistance: number;
  FinalizedHeadBlock: [string, number];
  Forkrate: number;
  Hashrate: number;
  HeadBlock: [string, number];
  HeadBlockOutWeight: number;
  PendingArchive: number;
  ShardIndex: number;
  State: {
    GasPrice: [number, number];
    ResidentTxn: number;
    PendingTxn: number;
    RequestingTxn: number;
    AddressCount: number;
    StateSize: number;
  };
  Throughput: number;
}

export interface Block {
  GasFee: string;
  Hash: string;
  Height: number;
  Miner: string;
  Reward: string;
  Shard: [number, number];
  Timestamp: number;
  TxnCount: [number, number];
  Uncle: number;
}

export async function Hub() {
  return await webapi<HubRes, {}>("/hub");
}

export async function Shard(idx: number): Promise<ShardDetail> {
  return webapi<ShardDetail, {}>("/shard?idx=" + idx);
}

export async function Summary(): Promise<HubRes> {
  const response = await Hub();
  const getShards = response.Shards.map((_, idx) => Shard(idx));
  const shards = await Promise.all(getShards);
  response.Shards.forEach((shard, i) => {
    shard.detail = shards[i];
  });
  return response;
}

export async function RecentBlockListByShard(
  idx: number,
  maxHeight: number,
  limit = 20
) {
  return webapi<Block, {}>(
    `/block_list_height?idx=${idx}&from=${maxHeight}&to=0&limit=${limit}`
  );
}

export async function Bootstrap() {
  return webapi<{}, {}>("/get_node_bootstrap");
}

export async function Shardsync() {
  return webapi<{}, {}>("/get_node_shardsync");
}
