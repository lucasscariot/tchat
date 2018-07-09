import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Input, Button, Badge, List } from 'antd'

import { updateColor, updateId } from '../store/general'
import { init, initAll } from '../store/websocket'
import { sendMessage } from '../store/messages'
import socket from '../config/socket'

const { Header, Footer, Sider, Content } = Layout

class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isInitialized: false,
      username: '',
      message: '',
    }

    this.props.init()
  }

  initialize = () => {
    this.setState({ isInitialized: true })
    this.props.initAll()
  }

  sendMessage = event => {
    const { message } = this.state

    if (message === '') return

    this.props.sendMessage(message)

    this.setState({ message: '' })
  }

  messageTyping = (event) => {
    this.setState({ message: event.target.value })
    if (event.target.value === '') {
      socket.emit('STOPPED_TYPING')
    } else {
      socket.emit('STARTED_TYPING')
    }
  }

  render() {
    const { users, general, messages } = this.props
    const { username } = general
    const { isInitialized } = this.state

    if (username && !isInitialized) {
      this.initialize()
    }

    return (
      <Layout>
        <Header style={{ color: 'white' }}>
          <p>Welcome! You are logged as <b>{username}</b></p>
        </Header>
        <Layout>
          <Sider style={{ padding: 10, backgroundColor: '#f0f2f5' }}>
            {users.map((user, index) => (
              <div key={index} style={{ display: 'flex' }}>
                <Badge style={{ marginLeft: 10 }} status={user.isConnected ? 'success' : 'error'} />
                <p>{user.username}</p>
              </div>
            ))}
          </Sider>

          <Layout>
            <Content style={{ padding: '0 50px' }}>
              <List
                itemLayout="horizontal"
                dataSource={messages}
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
            </Content>
            <Footer>
              <div style={{ display: 'flex' }}>
                <Input placeholder="Type your message.." value={this.state.message} onChange={this.messageTyping} />
                <Button type="primary" onClick={this.sendMessage} style={{ marginLeft: 10 }}>
                  Send
                </Button>
              </div>
              {users.filter(user => user.isTyping).length > 0 &&
                <p
                  style={{
                    margin: 0,
                    marginTop: 4,
                    fontSize: 10,
                    position: 'absolute'
                  }}
                >
                  {users
                    .filter(user => user.isTyping)
                    .map(user => user.username)
                    .join(', ')
                  }&nbsp;
                  {users
                    .filter(user => user.isTyping)
                    .length > 1 ? 'are' : 'is'
                  } typing..
                </p>
              }
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}


const mapStateToProps = state => ({
  messages: state.messages,
  general: state.general,
  users: state.users
})

const mapDispatchToProps = {
  updateColor,
  sendMessage,
  updateId,
  initAll,
  init
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)