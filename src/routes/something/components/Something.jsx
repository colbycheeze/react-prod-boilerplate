import React, { PureComponent } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { somethingSelector, doSomething } from '../modules/something';

const mapStateToProps = (state) => ({
  thing: somethingSelector(state).thing,
});
const actions = {
  doSomething,
};
export class Something extends PureComponent {
  static propTypes = {
    thing: PT.string.isRequired,
    doSomething: PT.func.isRequired,
  }

  handleClick = () => {
    this.props.doSomething();
  }

  render = () => {
    const { thing } = this.props;

    return (
      <div>
        Something: {thing}
        <br />
        <button onClick={this.handleClick}>Do Something</button>
      </div>
    );
  }
}
export default connect(mapStateToProps, actions)(Something);
