import React from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import { Layout, Input, Button, Badge, List } from 'antd'

import { updateColor, updateId } from '../store/general'

const { Header, Footer, Sider, Content } = Layout

class Chat extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isInitialized: false,
      username: '',
      message: '',
      messages: [],
      users: [],
    }

    this.socket = io('localhost:8080')

    this.socket.on('NEW_USER', (data) => {
      this.setState({ users: [...this.state.users, data] })
    })

    this.socket.on('DISCONNECT_USER', (data) => {
      const { users } = this.state

      const userIndex = users.findIndex(user => user.id === data)

      if (userIndex === -1) return

      users[userIndex].isConnected = false

      this.setState({ users })
    })
  }

  initialize = () => {
    const { username } = this.props.general
    const { updateColor, updateId } = this.props

    this.setState({ isInitialized: true })

    this.socket.emit('ADD_USER', { username })

    this.socket.on('RECEIVE_MESSAGE', (data) => {
      this.setState({ messages: [...this.state.messages, data] })
    })

    this.socket.on('WELCOME_USER', (data) => {
      updateColor(data.color)
      updateId(data.id)
    })

    this.socket.on('USER_IS_TYPING', (data) => {
      const { users } = this.state

      const userIndex = users.findIndex(user => user.id === data)

      if (userIndex === -1) return

      users[userIndex].isTyping = true

      this.setState({ users })

      setTimeout(() => {
        users[userIndex].isTyping = false
        this.setState({ users })
      }, 5000);
    })

    this.socket.on('USER_STOPPED_TYPING', (data) => {
      const { users } = this.state

      const userIndex = users.findIndex(user => user.id === data)

      if (userIndex === -1) return

      users[userIndex].isTyping = false

      this.setState({ users })
    })
  }

  sendMessage = event => {
    const { username, id, color } = this.props.general
    const { message } = this.state

    event.preventDefault()

    if (message === '') return

    this.socket.emit('SEND_MESSAGE', {
      color,
      message,
      username,
      userId: id
    })

    this.socket.emit('STOPPED_TYPING')

    this.setState({ message: '' })
  }

  messageTyping = (event) => {
    this.setState({ message: event.target.value })
    if (event.target.value === '') {
      this.socket.emit('STOPPED_TYPING')
    } else {
      this.socket.emit('IS_TYPING')
    }
  }

  render() {
    const { username } = this.props.general
    const { isInitialized } = this.state

    if (username && !isInitialized) {
      this.initialize()
    }

    return (
      <Layout>
        <Sider style={{ padding: 10, backgroundColor: '#f0f2f5' }}>
          {this.state.users.map((user, index) => (
            <div key={index} style={{ display: 'flex' }}>
              <Badge style={{ marginLeft: 10 }} status={user.isConnected ? 'success' : 'error'} />
              <p>{user.username}</p>
            </div>
          ))}
        </Sider>
        <Layout>
          <Header style={{ color: 'white' }}>
            <p>Welcome! You are logged as <b>{username}</b></p>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <List
              itemLayout="horizontal"
              dataSource={this.state.messages}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<div style={{ width: 25, height: 25, backgroundColor: item.color, marginTop: 5, borderRadius: 3 }} />}
                    title={item.username}
                    description={item.message}
                  />
                </List.Item>
              )}
            />
            {this.state.users.filter(user => user.isTyping).map(user => <p key={user.id}>{user.username} is typing..</p>)}
          </Content>
          <Footer>
            <div style={{ display: 'flex' }}>
              <Input placeholder="Type your message.." value={this.state.message} onChange={this.messageTyping} />
              <Button type="primary" onClick={this.sendMessage} style={{ marginLeft: 10 }}>
                Send
              </Button>
            </div>
          </Footer>
        </Layout>
      </Layout>
    )
  }
}


const mapStateToProps = state => ({
  general: state.general
})

const mapDispatchToProps = {
  updateColor,
  updateId
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)