import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Transforms } from "slate";
import { toggleBlock, isBlockActive } from "./BlockButton";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels } from "./TooltipContent/hotkeys";
import isEmpty from "lodash/isEmpty";
import * as Styled from "./styles";

const getActiveBlock = editor => {
  const h1 = isBlockActive(editor, "h1");
  const h2 = isBlockActive(editor, "h2");
  const h3 = isBlockActive(editor, "h3");
  const h4 = isBlockActive(editor, "h4");
  const p = isBlockActive(editor, "p");

  const activeCount = [p, h1, h2, h3, h4].filter(Boolean).length;

  if (activeCount > 1) return "";
  if (h1) return "h1";
  if (h2) return "h2";
  if (h3) return "h3";
  if (h4) return "h4";
  return "p";
};

const BlockSelect = ({ options, selection, ...rest }, ref) => {
  const editor = useSlate();

  const renderOptions = options.map(o => (
    <option key={o.format} value={o.format} hidden={!o.format}>
      {o.label}
    </option>
  ));

  const active = getActiveBlock(editor);

  return (
    <Tooltip
      content={
        <TooltipContent label={labels[active]} hotkeys={hotkeys[active]} />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <Styled.SelectWrapper>
        <Styled.Select
          ref={ref}
          {...rest}
          aria-label="Text styles"
          data-active={active !== "p" && active !== ""}
          value={active}
          onChange={e => {
            e.preventDefault();
            if (isEmpty(selection)) return;
            Transforms.select(editor, selection);
            toggleBlock(editor, e.target.value);
            ReactEditor.focus(editor);
          }}
          tabIndex={-1}
        >
          {renderOptions}
        </Styled.Select>
        <Styled.SelectIcon icon="disclosureDown24" size={16} />
      </Styled.SelectWrapper>
    </Tooltip>
  );
};

export default forwardRef(BlockSelect);