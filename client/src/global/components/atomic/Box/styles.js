import styled from "@emotion/styled";
import {
  panelRounded,
  containerPrototype,
  fluidScale
} from "theme/styles/mixins";
import { containerPadding } from "theme/styles/variables/layout";
import { breakpoints } from "theme/styles/variables/media";

export const Container = styled.section`
  ${containerPrototype}
  padding-inline: ${fluidScale(
    containerPadding.full,
    "0px",
    breakpoints[120],
    breakpoints[120]
  )};
  padding-block: var(--Box-Container-padding-block, 0);
`;

export const Background = styled.div`
  ${panelRounded}
  padding-block: var(--Box-Background-padding-block, 20px);
  padding-inline: var(
    --Box-Background-padding-inline,
    ${fluidScale("72px", "20px")}
  );
`;