import * as React from "react";
import Title from "components/Title";
import cn from "classnames";
import styles from "./styles.module.scss";

interface Props {
  title?: string;
  classname?: string;
  children: React.ReactNode;
  showTitle?: boolean;
}

const BigCard: React.FunctionComponent<Props> = function (props: Props) {
  const { showTitle = true } = props;
  return (
    <div className={cn([styles.bigcard, props.classname])}>
      {showTitle && (
        <Title style={{ flex: "none" }} value={props.title || ""} />
      )}
      {props.children}
    </div>
  );
};

export default BigCard;
