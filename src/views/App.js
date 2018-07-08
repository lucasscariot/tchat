import React, { Component } from 'react'
import { connect } from 'react-redux'
import Chat from './Chat'
import ChooseUsername from './ChooseUsername'

class App extends Component {
  render() {
    const { username } = this.props.general
    return (
      username ? <Chat /> : <ChooseUsername />
    )
  }
}

const mapStateToProps = state => ({
  general: state.general
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(App)