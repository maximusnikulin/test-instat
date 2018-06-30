import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class Counter extends Component {
  @observable
  count = 0;   
  handleDecrement = () => {
    this.count--;
  }

  handleIncrement = () => {
    this.count++;
  }

  render() {    
    return (
      <div>
        <div>{this.count}</div>
        <button onClick={() => console.log(this.count)}>click</button>
        <button onClick={this.handleIncrement}>+</button>  
        <button onClick={this.handleDecrement}>-</button>  
      </div>
    );
  }
}

export default Counter

