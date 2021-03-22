import * as React from "react";
import styles from "./styles.module.scss";

interface Props {
  value: string;
  style?: React.CSSProperties;
}

const Title: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={styles.title} style={props.style}>
      {props.value}
    </div>
  );
};

export default Title;
