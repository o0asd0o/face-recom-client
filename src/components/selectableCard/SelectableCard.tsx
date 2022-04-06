import styled from "@emotion/styled";
import { Card } from "@mui/material";
import styles from "./SelectableCard.module.scss";
import React from "react";
import classNames from "classnames";

type Props = {
    selected: boolean;
    onClick(): void;
};

const transition = "all 0.3s cubic-bezier(.25,.8,.25,1)";
const boxShadow = "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)";
const boxShadowHover = "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)";

const CardContainer = styled(Card)`
    transition: ${transition};
    box-shadow: ${boxShadow};
    cursor: pointer;
    &:hover {
        box-shadow: ${boxShadowHover};
    }
`

const SelectableCard: React.FC<Props> = ({ selected, onClick, children }) => {
    return (
      <CardContainer>
        <div 
            className={classNames(styles.selectable, {
                [styles.selected]: selected
            })}
            onClick={() => onClick()}
        >
          {children}
          <div className={styles.check}><span className={styles.checkmark}>✔</span></div>
        </div>
      </CardContainer>
    );
};

export default SelectableCard;