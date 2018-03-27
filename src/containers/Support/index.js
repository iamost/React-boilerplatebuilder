import React, { Component } from 'react'
import Header from 'components/Header'
import Billboard from 'components/Billboard'
import FAQ from 'components/FAQ'
import ContactForm from 'components/ContactForm'
import 'styles/core.scss'

class Support extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div>
          <Billboard />
          <FAQ />
          <ContactForm />
        </div>
      </div>
    )
  }
}

export default Support
