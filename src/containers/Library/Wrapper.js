import styled, { css } from 'styled-components';

export default styled.div`
  display: flex;
  > div {
    display: flex;
  }

  > div:first-child {
    > span {
      > div {
        cursor: initial !important;

        &:nth-child(2) {
          cursor: ew-resize !important;
        }
      }
    }
  }

  ${({ reuse }) =>
    reuse &&
    css`
      flex: none !important;
    `};
`;
