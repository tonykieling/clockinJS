import React, { Component } from 'react'

export default class PunchInNew extends Component {

  state = {
    clients: null
  }

  componentDidMount() {
    console.log("this.componentDidMount");
    setTimeout(() => {
      this.setState({
        clients: ["a", "b", "c"]
      })
      console.log("this.state.clients", this.state.clients);
      }, 1500);
  }

  x = () => {
    console.log("XXX: ", this.state.clients);
    return (this.state.clients.map((client, id) => <li key={id}>{client}</li>))
  }

  render() {
    return (
      <div>
        <h1>
          PunchIn New over here CLASS
        </h1>
        <p>changing state after componentDidMount and working on looping of a list of items</p>
        { this.state.clients
         ? this.x()
         : null }
      </div>
    )
  }
}
