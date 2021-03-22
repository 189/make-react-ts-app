import * as React from "react";
import styles from "./styles.module.scss";

interface PrimaryHeaderProps {}

const PrimaryHeader: React.FunctionComponent<PrimaryHeaderProps> = function PrimaryHeader() {
  return <header className={styles.topbar}>Monoxide区块链系统监控大屏</header>;
};

export default PrimaryHeader;
