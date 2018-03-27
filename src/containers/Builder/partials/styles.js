import styled from 'styled-components';

export const FlexChildWrap = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
`;

export const SelectionWrapper = styled.div`
  background-color: ${({ expanded }) => (expanded ? '#f7f7f7' : '#fff')};
  .selection-plain {
    padding: 15px 12px 15px 0;
    cursor: pointer;
    padding-left: ${({ paddingLeft }) => (paddingLeft ? paddingLeft : 22)}px;
  }

  .bottom-section-border {
    border-bottom: 1px solid #e2e2e2;
  }

  .selection-inner {
    padding-right: 16px;
    display: flex;
    align-items: center;

    .inner-text {
      display: inline-block;
      color: ${({ expanded }) =>
        expanded ? 'rgb(55, 109, 114);' : 'rgb(129, 129, 129)'};
      padding-left: 8px;
      font-size: 14px;
      font-weight: 400;
      vertical-align: middle;
    }

    .func-icons {
      margin-left: auto;
      font-size: 15px;

      .pad_10 {
        padding-right: 10px;

        a {
          text-decoration: none;
        }
      }
    }
  }

  .block-text {
    font-family: 'Times New Roman', serif;
    font-size: 15px;
    line-height: 1.25;
  }

  .block-icons {
    width: 90px;
    padding: 10px 15px;
    text-align: right;
  }
`;
