import * as React from "react";
import BigCard from "components/BigCard";
import { ellipsis, format } from "utils/help";
import cn from "classnames";
// import Table from "rc-table";

// import "./table.css";
import styles from "./styles.module.scss";
import { ShardSummary, RecentBlockListByShard, Block } from "service/chain";
interface Props {
  shards: ShardSummary[];
}

interface State {
  blocks: Block[];
}

export default class RecentBlock extends React.PureComponent<Props, State> {
  state: State = {
    blocks: [],
  };

  async getRecentBlockList(shards: ShardSummary[]) {
    if (shards.length > 0) {
      const blockPromises = shards.map((shard, idx) => {
        const max = shard.detail.ArchivedHeight;
        return RecentBlockListByShard(idx, max, 20);
      });
      const response = await Promise.all(blockPromises);
      const blocks = response
        .flat(1)
        .sort((prev, current) => current.Timestamp - prev.Timestamp)
        .slice(0, 20);
      this.setState({ blocks });
    }
  }

  componentDidMount() {
    this.getRecentBlockList(this.props.shards);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.shards.length !== this.props.shards.length) {
      this.getRecentBlockList(nextProps.shards);
    }
  }

  get column() {
    return [
      {
        title: "Zone",
        dataIndex: "Shard",
        key: "Shard",
        width: 30,
        render(value: any[]) {
          return value[0];
        },
      },
      {
        title: "Height",
        dataIndex: "Height",
        key: "Height",
      },
      {
        title: "Hash",
        dataIndex: "Hash",
        key: "Hash",
        render(value: string) {
          return ellipsis(value);
        },
      },
      {
        title: "Timestamp",
        dataIndex: "Timestamp",
        key: "Timestamp",
        render(value: number) {
          return format(value, "HH:mm:ss");
        },
      },
      {
        title: "Reward",
        dataIndex: "Reward",
        key: "Reward",
        render(value: number) {
          console.log(value, value / 1e8);
          return value / 1e8;
        },
      },
    ];
  }

  render() {
    return (
      <BigCard classname={styles.recent} title="Recent Block">
        <div style={{ width: "100%", position: "relative", overflow: "auto" }}>
          {/* <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>Height</th>
                <th>Hash</th>
                <th>Time</th>
                <th>Reward</th>
              </tr>
            </thead>
            <tbody>
              {this.state.blocks.map(block => (
                <tr>
                  <td>{block.Shard[0]}</td>
                  <td>{block.Height}</td>
                  <td>{ellipsis(block.Hash)}</td>
                  <td data-item={block.Timestamp}>{format(block.Timestamp, "YYYY-MM-DD HH:mm:ss")}</td>
                  <td>{block.Reward}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
          {/* <Table
            tableLayout="fixed"
            style={{ width: "5.31rem" }}
            columns={this.column}
            rowKey="Hash"
            sticky={true}
            data={this.state.blocks}
          /> */}
          <ul className={cn([styles.hd, styles.blocklist])}>
            <li className={styles.small}>Zone</li>
            <li>Height</li>
            <li>Hash</li>
            <li>Time</li>
            <li>Reward</li>
          </ul>
          <div className={cn([styles.bd, styles.blocklist, "ui-scroll"])}>
            {this.state.blocks.map((block, idx) => (
              <ul key={idx}>
                <li className={styles.small}>{block.Shard[0]}</li>
                <li>{block.Height}</li>
                <li>{ellipsis(block.Hash)}</li>
                <li data-item={block.Timestamp}>
                  {format(block.Timestamp, "HH:mm:ss")}
                </li>
                <li>{Number(block.Reward) / 1e8}</li>
              </ul>
            ))}
          </div>
        </div>
      </BigCard>
    );
  }
}
