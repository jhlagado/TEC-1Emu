import React, { Component } from 'react';
import styled, { css } from 'styled-components'

const SS = styled.div`
      width: 36px;
      margin: 4px;
      margin-right: 12px;
      /*
      margin-left: ${props => props.margin ? '16px' : null};
      */
      position relative;
      display: inline-block;
    `
const SS_A = styled.div`
      box-sizing: border-box;
      height: 28px;
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
      box-sizing: border-box;
      height: 24px;
      border: 4px solid red;
      border-top: none;
      border-right: ${props => !(props.value & 0x20) && 'none'};
      border-left: ${props => !(props.value & 0x40) && 'none'};
      border-bottom: ${props => !(props.value & 0x80) && 'none'};
    `

const SevenSeg = (props) => {
  return (
    <SS margin={props.margin}>
      <SS_A value={props.value}></SS_A>
      <SS_B value={props.value}></SS_B>
      <SS_DP value={props.value}></SS_DP>
    </SS>
  );
}

// function toDecimals(value, num) {
//   const array = Array(num);
//   for (let i = num - 1; i >= 0; i--) {
//     array[i] = value & 0xF;
//     value = value >> 4;
//   }
//   return array;
// }

// const HEXSEGTBL =
//   [
//     0xEB, 0x28, 0xCD, 0xAD,
//     0x2E, 0xA7, 0xE7, 0x29,
//     0xEF, 0x2F, 0x6F, 0xE6,
//     0xC3, 0xEC, 0xC7, 0x47
//   ];

// const toSegment = (digit) => HEXSEGTBL[digit];

export const Display = ({ value = Array(6) }) =>
  <React.Fragment>{
  }{
    [...value].reverse().map((display, index) => (
        <SevenSeg key={`a_${index}`} value={display}></SevenSeg>
      ))
  }</React.Fragment>

  // export const Display = (props) => {

  // let addr = toDecimals(props.addr, 4).map(toSegment);
  // let data = toDecimals(props.data, 2).map(toSegment);

//   return (<div>
//     {addr.map((digit, index) => <SevenSeg key={`a_${index}`} value={digit}></SevenSeg>)}
//     <span>&nbsp;</span>
//     {data.map((digit, index) => <SevenSeg key={`a_${index}`} value={digit}></SevenSeg>)}
//   </div>);
// }
