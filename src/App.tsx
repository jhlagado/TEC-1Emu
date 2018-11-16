import React, { Component } from 'react';
import styled, { css } from 'styled-components'

import logo from './logo.svg';
import './App.css';
import { Z80 } from './z80';

class App extends Component {
  render() {

    const memory = Array(100).map(() => 0xFF);
    const io = Array(256);

    const cpu = Z80({
      mem_read: (addr) => memory[addr],
      mem_write: (addr, value) => memory[addr] = value,
      io_read: (port) => io[port],
      io_write: (port, value) => io[port] = value,
    });

    const program = [0x21, 0x50, 0x00, 0x3E, 0x23, 0x77, 0x76]
    program.forEach((byte, index) => memory[index] = byte);

    cpu.reset();
    function* runner() {
      while (true) {
        let result = cpu.run_instruction();
        if (result === 1)
          return 1
        yield result;
      }
    }

    const it = runner();
    let result = it.next();
    while (!result.done) {
      console.log(result.value);
      result = it.next();
    }

    const m = memory.map(byte => byte.toString(16).padStart(2, '0'));
    console.log(m);

    const SS = styled.div`
      width: 36px;
      margin: 4px;
      margin-right: 12px;
      margin-left: ${props => props.margin ? '16px' : null};
      position relative;
      display: inline-block;
    `
    const SS_A = styled.div`
      height: 24px;
      border: 4px solid red;
      border-top: ${props => !(props.value & 0x01) && 'none'};
      border-left: ${props => !(props.value & 0x02) && 'none'};
      border-bottom: ${props => !(props.value & 0x04) && 'none'};
      border-right: ${props => !(props.value & 0x08) && 'none'};
    `
    const SS_DP = styled.div`
      width: 5px;
      height: 5px;
      background-color: red;
      position: absolute;
      right: -8px;
      bottom: -2px;
      display: ${props => (props.value & 0x10) ? 'block' : 'none'};
    `
    const SS_B = styled.div`
      height: 24px;
      border: 4px solid red;
      border-top: none;
      border-right: ${props => !(props.value & 0x20) && 'none'};
      border-left: ${props => !(props.value & 0x40) && 'none'};
      border-bottom: ${props => !(props.value & 0x80) && 'none'};
    `

    const SevenSeg = (props) => {
      return (
        <SS {...props}>
          <SS_A {...props}></SS_A>
          <SS_B {...props}></SS_B>
          <SS_DP {...props}></SS_DP>
        </SS>
      );
    }

    const SevenSegDisplay = (props) => {
      <div>
        <SevenSeg value="0xFF"></SevenSeg>
        <SevenSeg value="0xFF"></SevenSeg>
        <SevenSeg value="0xFF"></SevenSeg>
        <SevenSeg value="0xFF"></SevenSeg>
        <SevenSeg value="0xFF" margin={true}></SevenSeg>
        <SevenSeg value="0xFF"></SevenSeg>
      </div>
    }

    return (
      <div className="App">

        <SevenSegDisplay addr="0x0800" data="0x3F">
        </SevenSegDisplay>

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
