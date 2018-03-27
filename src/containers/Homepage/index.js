import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import DocumentManageModal from '../Documents/DocumentManageModal';
import Header from '../../components/Header'
import ChooseTemplate from '../../components/Boxes/ChooseTemplate'
import EditLibrary from '../../components/Boxes/EditLibrary'
import CreateDocument from '../../components/Boxes/CreateDocument'
import HelpButton from '../../components/UI/HelpButton'
import { createDocument, getDocuments } from '../../api/modules/document'
import './styles.scss'

class Homepage extends Component {
    constructor(self) {
        super(self);
        if (!this.props.state.auth.token) {
            this.props.history.push('/login');
        }
        this.state = {
          showDocumentManageModal: false,
          documents: []
        }
    }
    componentWillReceiveProps(newProps) {
        if (!newProps.state.auth.token) {
            newProps.history.push('/login');
        }
    }
    componentWillMount() {
      this.retrieveDocuments();
    }
    retrieveDocuments() {
        this.props.getDocuments();
    }
    openDocumentManageModal = () => {
      this.setState({
        showDocumentManageModal: true
      });
    }
    closeDocumentManageModal = () => {
      this.setState({
        showDocumentManageModal: false
      });
    }
    onCreateDocument = (data) => {
      const success = (res, action) => {
        this.closeDocumentManageModal();
      };
      this.props.createDocument({
        body: data,
        success
      });
    };
    render() {
        const { showDocumentManageModal } = this.state;
        return (
            <div className="homePageWrp">
              <Header />
              <div className="homePageContainer">
                <div className="prefaceContainer">
                  <img
                    src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/logo_small_white.png"
                    alt="builder-logo"
                    className="img-logo" />
                  <h1 className="preface-text">Let's create something great.</h1>
                </div>
                <div className="boxes-wrp">
                  <ChooseTemplate />
                  <EditLibrary />
                  <CreateDocument openDocumentModal={this.openDocumentManageModal}/>
                </div>
                {showDocumentManageModal &&
                  <DocumentManageModal
                    title=""
                    client=""
                    type=""
                    dueDate=""
                    isEdit={false}
                    onHide={this.closeDocumentManageModal}
                    onSubmit={this.onCreateDocument}
                  />
                }
                <HelpButton link="/support"/>
              </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        state
    };
}
const mapActionToProps = {
  createDocument,
  getDocuments
};
export default withRouter(connect(mapStateToProps, mapActionToProps)(Homepage))
