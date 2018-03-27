import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex: 1 1 0%;
  height: 100%;

  .section-header-wide {
    flex: 1 1 auto;
  }

  .flex-d {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .flex-whole {
    flex: 1 1 0%;
  }

  .left-section-border {
    border-left: 1px solid #e2e2e2;
  }

  .section-header-box {
    background-color: #f7f7f7;
    height: 80px;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid #e2e2e2;
  }

  .flex-main {
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .search-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 80px;
    padding-left: 40px;
    background-color: #f7f7f7;
    border-top: 1px solid #e2e2e2;

    i {
      margin-right: 10px;
      font-size: 16px;
    }

    input {
      color: rgb(124, 124, 124);
      width: 80%;
    }
  }

  .section-header-title {
    color: #376d72;
    font-size: 16px;
    font-weight: 700;
  }

  .pointer-s {
    cursor: pointer;
  }

  .white-bg {
    background: #fff !important;
  }

  .overflow-y-s {
    overflow-y: auto;
  }

  .bottom-section-boarder {
    border-bottom: 1px solid #e2e2e2;
  }

  .close-modal {
    color: '#d35400';
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
    letter-spacing: 0.6px;
  }
`;

export const SpV = styled.div`
  display: block;
  height: ${({ value }) => (value ? value : 0)}px;
`;

export const SpH = styled.div`
  display: inline-block;
  width: ${({ value }) => (value ? value : 0)}px;
`;
