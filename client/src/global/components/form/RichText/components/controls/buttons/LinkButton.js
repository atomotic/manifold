import React, { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element as SlateElement, Transforms, Range } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import { isValidUrl } from "../../../utils/helpers";
import InsertLinkForm from "./insert/LinkForm";
import { useConfirmation } from "hooks";
import Modal from "./insert/Modal";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels } from "./TooltipContent/hotkeys";
import isEmpty from "lodash/isEmpty";
import * as Styled from "./styles";

export const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "a"
  });
  return !!link;
};

export const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "a"
  });
  ReactEditor.focus(editor);
};

export const wrapLink = (editor, url) => {
  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "a",
    htmlAttrs: { href: url },
    children: isCollapsed ? [{ text: url }] : []
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }

  ReactEditor.focus(editor);
};

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
  ReactEditor.focus(editor);
};

const LinkButton = ({ icon, size, selection, ...rest }, ref) => {
  const editor = useSlate();
  const active = isLinkActive(editor);
  const { confirm, confirmation } = useConfirmation();
  const urlRef = useRef(null);
  const { t } = useTranslation();

  const addLink = close => {
    const url = urlRef?.current?.inputElement?.value;
    if (!url) return;
    if (!isValidUrl(url));
    close();
    insertLink(editor, url);
  };

  const onModalClose = close => {
    close();
    const [node] = Editor.above(editor, { at: selection.focus.path });
    const val = node?.selection_tracker_ignore ?? false;
    Transforms.setNodes(
      editor,
      { selection_tracker_ignore: !val },
      { at: selection.focus.path.slice(0, -1) }
    );
    ReactEditor.focus(editor);
  };

  const getLinkData = e => {
    e.preventDefault();
    if (isEmpty(selection)) return;
    if (active) return unwrapLink(editor);
    const heading = "Insert Link";
    const form = <InsertLinkForm urlRef={urlRef} />;
    if (confirm)
      confirm({
        heading,
        icon,
        form,
        callback: addLink,
        closeCallback: onModalClose,
        resolveLabel: t("actions.add")
      });
  };

  return (
    <Tooltip
      content={<TooltipContent label={labels.link} hotkeys={hotkeys.link} />}
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <Styled.Button
        name="link-modal-trigger"
        ref={ref}
        {...rest}
        aria-label="link"
        data-active={active}
        onClick={getLinkData}
        tabIndex={-1}
      >
        {icon && <Utility.IconComposer icon={icon} size={size} />}
        {confirmation && <Modal {...confirmation} />}
      </Styled.Button>
    </Tooltip>
  );
};

export default forwardRef(LinkButton);