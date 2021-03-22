import * as React from "react";
import Title from "components/Title";
import cn from "classnames";
import styles from "./styles.module.scss";

interface Props {
  imageSrc: string;
  title: string;
  value: number | string;
  classname?: string;
}

const Card: React.FunctionComponent<Props> = function (props: Props) {
  return (
    <div className={cn([styles.card, props.classname])}>
      <Title value={props.title} />
      <img src={props.imageSrc} alt="" />
      <span className="ui-font-bold">{props.value}</span>
    </div>
  );
};

export default Card;
