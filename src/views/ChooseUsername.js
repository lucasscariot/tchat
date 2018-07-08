import React from 'react'
import { connect } from 'react-redux'
import { submitUsername } from '../store/general'

class ChooseUsername extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
    }
  }

  submitUsername = () => {
    this.props.submitUsername(this.state.username)
  }

  render() {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
            <div className="card-title">
Choose username
            </div>
          </div>
          <div className="card-footer">
            <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} className="form-control" />
            <br />
            <button onClick={this.submitUsername} className="btn btn-primary form-control">
Send
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = {
  submitUsername,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseUsername)