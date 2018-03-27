import styled from 'styled-components';

export default styled.div`
  width: 100%;

  .section-header-block {
    .header1 {
      flex: 1 1 0%;
    }

    i {
      cursor: pointer;
    }

    i + i {
      margin-left: 10px;
    }
  }

  .tree-container {
    flex: 1 1 0%;
    overflow-y: auto;

    .empty {
      font-size: 13px;
      color: rgb(175, 175, 175);
      text-align: center;
    }

    ul {
      ul {
        margin-left: 24px;
      }

      > li {
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0px;
        }

        .actionable {
          display: flex;
          align-items: center;
          cursor: pointer;

          .arrow {
            padding-right: 24px;

            > div {
              display: inline-block;
              text-align: center;
              width: 16px;
              margin-right: -16px;
              font-size: 16px;
              cursor: pointer;
            }
          }

          .content {
            display: inline-block;

            > div {
              display: inline-block;
              text-align: center;
              width: 16px;
            }

            .tree-text {
              padding-left: 8px;
            }
          }

          .actions {
            a {
              cursor: pointer;
            }
          }
        }
      }
    }

    .drop-here-area.selected {
      background-color: #eee;
    }
  }

  .search-container {
    i {
      margin-right: 10px;
      font-size: 16px;
    }

    input {
      color: rgb(124, 124, 124);
      width: 80%;
    }
  }
`;
