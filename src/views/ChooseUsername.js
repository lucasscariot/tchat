import React from 'react'
import { connect } from 'react-redux'
import { submitUsername } from '../store/general'
import { Modal, Input, Button } from 'antd'

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
      <Modal
        visible={true}
        title="Choose username"
        footer={[
          <Button key="Submit" onClick={this.submitUsername}>Submit</Button>
        ]}
      >
        <Input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} />
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = {
  submitUsername,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseUsername)