import React from "react";
import * as Styled from "./styles";

export default function FooterPartsColumns({ standalone, children }) {
  return (
    <Styled.Columns className="container">
      <Styled.Row $standalone={standalone}>{children}</Styled.Row>
    </Styled.Columns>
  );
}