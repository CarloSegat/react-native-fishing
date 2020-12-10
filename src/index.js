import React, { useState, useEffect, useReducer, useContext } from 'react';
import { render } from 'react-dom';

const FishContext = React.createContext('trout');

class FishingDemoApp extends React.Component {
  state = {
    caughtFish: 0,
    fishingFor: 'trout'
  };

  _reducer(state, action) {
    switch (action.type) {
      case 'catch':
        return { ...state, caughtFish: state.caughtFish + 1 };
      case 'release':
        return { ...state, caughtFish: state.caughtFish - 1 };
      case 'setFish':
        return { ...state, fishingFor: action.payload };
      default:
        return state;
    }
  }

  reducer(action) {
    this.setState(this._reducer(this.state, action));
  }

  render() {
    return (
      <FishContext.Provider value={this.state}>
        <FishingBucket dispatch={action => void this.reducer(action)} />
        <CaughtFish dispatch={action => void this.reducer(action)} />
      </FishContext.Provider>
    )
  }
}

function CaughtFish({ dispatch }) {
  return (
    <FishContext.Consumer>{fishState => <>
      <button onClick={() => Math.random() > 0.5 && dispatch({ type: 'catch' })}>Cast a line</button>
      <p>Caught {fishState.caughtFish}</p>
    </>}</FishContext.Consumer>
  )
}

class FishingBucketClassDisplay extends React.Component {
  state = {
    baitType: null
  }

  setBaitType(baitVal) {
    this.setState({ baitType: baitVal });
  }

  setBaitTypeSwitch(fishVal) {
    switch (fishVal) {
      case 'trout':
        this.setBaitType('smelly-stuff');
        break;
      case 'salmon':
        this.setBaitType('roe');
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    this.setBaitTypeSwitch(this.props.fishType);
  }

  componentDidUpdate(prevprops) {
    if (prevprops.fishType !== this.props.fishType) {
      this.setBaitTypeSwitch(this.props.fishType);
    }
  }

  render() {
    const { fishType, setFishType, dispatch } = this.props;
    const { baitType } = this.state;
    return <>
      <h3>This is the class based component</h3>
      <button onClick={() => dispatch({ type: 'setFish', payload: 'trout' })}>Fish for Trout</button>
      <button onClick={() => dispatch({ type: 'setFish', payload: 'salmon' })}>Fish for Salmon</button>
      <p>We are fishing for {fishType} using {baitType}</p>
    </>
  }

}

export class FishingBucket extends React.Component {
  render() {
    return (
      <FishContext.Consumer>{fishState =>
        <FishingBucketClassDisplay fishType={fishState && fishState.fishingFor} {...this.props} />
      }</FishContext.Consumer>
    )
  }
}

render(<FishingDemoApp />, document.getElementById('root'));

