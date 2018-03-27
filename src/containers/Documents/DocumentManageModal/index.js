import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.scss';

class DocumentManageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dueDate: this.props.dueDate ? moment(this.props.dueDate) : null,
    };
  }

  componentWillMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  handleDateChange(date) {
    this.setState({
      dueDate: date,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit({
      title: e.target.elements.title.value,
      client: e.target.elements.client.value,
      type: e.target.elements.type.value,
      dueDate: this.state.dueDate ? this.state.dueDate.valueOf() : null,
    });
  }

  handleOutsideClick = e => {
    if (this.node.contains(e.target) || e.target.className.includes('react-datepicker')) {
      return;
    }
    this.props.onHide();
  };

  render() {
    const { title, client, type, isEdit } = this.props;
    return (
      <div className="wizard-container">
        <div className="wizard">
          <div
            className="wizard-content"
            ref={node => {
              this.node = node;
            }}
          >
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div>
                <input
                  placeholder="Title"
                  className="field"
                  required
                  defaultValue={title}
                  name="title"
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <input
                  placeholder="Customer"
                  className="field"
                  defaultValue={client}
                  name="client"
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <div id="new-document-wizard-type-input-wrapper">
                  <datalist id="new-document-wizard-type-list">
                    <option value="RFP" />
                    <option value="RFI" />
                    <option value="TO" />
                  </datalist>
                  <input
                    className="field"
                    placeholder="Type"
                    defaultValue={type}
                    name="type"
                    list="new-document-wizard-type-list"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <DatePicker
                  dateFormat="dddd MMM DD YYYY"
                  className="field"
                  placeholderText="Due date"
                  selected={this.state.dueDate}
                  onChange={this.handleDateChange.bind(this)}
                />
              </div>
              <button
                type="submit"
                className="large form button"
                style={{ marginTop: 20 }}
              >
                {isEdit ? 'Update ' : 'Create '}Document
              </button>
              <div className="service-help" style={{ marginTop: 30 }}>
                <Link to="support">Need help?</Link>
              </div>
              <div className="clear" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

DocumentManageModal.defaultProps = {
  dueDate: null,
};

DocumentManageModal.propsTypes = {
  isEdit: PropTypes.bool,
  title: PropTypes.string,
  client: PropTypes.string,
  type: PropTypes.string,
  dueDate: PropTypes.object,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default DocumentManageModal;
