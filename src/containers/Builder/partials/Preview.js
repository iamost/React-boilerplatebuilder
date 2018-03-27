import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Frame from 'react-frame-component';
import { Link } from 'react-router-dom';

import { FlexChildWrap } from './styles';

const propTypes = { previewSelection: PropTypes.object };

const defaultProps = {};

class Preview extends Component {
  state = {};

  renderInitialHtml = () => {
    return `
    <!DOCTYPE html><html><head>
    <link type="text/css" rel="stylesheet" href="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/for-html-preview.css">
    <style>
      @import 'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,600,700';
      ::-webkit-scrollbar { display: none; }
      html, body {  height: auto !important;}
      ol, ul {  margin-left: 55.349698934691986px !important;}
      ul, ul li {  list-style: disc inside !important;}
      ul li {  list-style-type: disc !important;}
      ul ul li {  list-style-type: circle !important;}
      ul ul ul li {  list-style-type: square !important;}
      ol, ol li {  list-style: none !important;}
      ol {  counter-reset: level1;}ol li {  display: block;}
      ol li::before {  content: counter(level1) '.';  counter-increment: level1;  margin-right: 22.139879573876794px;}
      ol ol {  counter-reset: level2;}
      ol ol li::before {  content: counter(level2) '.';  counter-increment: level2;}ol ol ol {  counter-reset: level3;}
      ol ol ol li::before {  content: counter(level3) '.';  counter-increment: level3;}ol ol ol ol {  counter-reset: level4;}
      ol ol ol ol li::before {  content: counter(level4) '.';  counter-increment: level4;}ol ol ol ol ol {  counter-reset: level5;}
      ol ol ol ol ol li::before {  content: counter(level5) '.';  counter-increment: level5;}table { font-size: inherit; }
      @media only screen and (max-width: 1024px) {
        body {
            font-size: 18px !important;
        }
      }

      @media only screen and (max-width: 700px) {
        body {
            font-size: 17px !important;
        }
      }

      @media only screen and (max-width: 600px) {
        body {
            font-size: 15px !important;
        }
      }

      @media only screen and (max-width: 500px) {
        body {
            font-size: 13px !important;
        }
      }

      @media only screen and (max-width: 300px) {
        body {
            font-size: 11px !important;
        }
      }
    </style>
  </head>  <body class="html-preview" style="font-family: 'Times New Roman', serif; line-height: 1.25; margin: 0; position: relative; "><div id="mount-preview"></div></body></html>
    `;
  };

  render() {
    const {
      selection: { title, textBlocks = [] },
      documentId,
      substituteVariables,
    } = this.props;
    return (
      <FlexChildWrap
        ref={node => {
          this.previewNode = node;
        }}
        className="flex-d left-section-border flex-col"
      >
        <div className="section-header-box">
          <div className="section-header-title section-header-wide">
            {title ? title : 'Content preview'}
          </div>
        </div>
        {title ? (
          <FlexChildWrap>
            <div
              className="section-padding flex-d flex-whole flex-col"
              style={{ paddingTop: 25 }}
            >
              <Frame
                title="preview-document"
                frameBorder="0"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
                initialContent={this.renderInitialHtml()}
                mountTarget="#mount-preview"
              >
                <div style={{ marginRight: 14, marginLeft: 4 }}>
                  {textBlocks.map((block, index) => (
                    <Fragment key={index}>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: substituteVariables(block),
                        }}
                      />
                      <br />
                    </Fragment>
                  ))}
                </div>
              </Frame>
            </div>
          </FlexChildWrap>
        ) : (
          <div
            style={{
              display: 'flex',
              flex: '1 1 0%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: 'rgb(175, 175, 175)',
              }}
            >
              Click on a content block to preview content.
            </div>
          </div>
        )}
        <Link
          to={`/preview/${documentId}`}
          className="bottom-navigation-button search-box"
        >
          Preview Document
        </Link>
      </FlexChildWrap>
    );
  }
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
