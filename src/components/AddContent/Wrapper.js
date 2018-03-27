import styled from 'styled-components';

export default styled.div`
  .buttons {
    margin-top: 15px;
    text-align: right;

    button + button {
      padding-left: 10px;
    }
  }

  .comment {
    color: rgb(136, 136, 136);
    font-size: 13px;
    margin-top: 15px;
  }
`;