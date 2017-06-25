import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import somethingReducer, {
  SOMETHING_KEY,
  DO_SOMETHING,
  doSomethingAction,
} from './something';

const setup = (initialState) => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const defaultInitialState = {
    [SOMETHING_KEY]: {
      thing: 'Default Thing',
    },
  };
  const store = mockStore(initialState || defaultInitialState);

  return { store };
};

describe('Something', () => {
  describe('Reducer', () => {
    it('initial state', () => {
      const action = '@@@@';
      const reducer = somethingReducer(undefined, action);

      expect(reducer).toEqual({
        thing: 'Default Thing',
        anotherThing: 'Yep',
      });
    });

    it('returns previous state if no type matches', () => {
      const action = '@@@@';
      const reducer = somethingReducer({}, action);

      expect(reducer).toEqual({});
    });
  });

  describe('Actions', () => {
    describe('doSomethingAction()', () => {
      it('action', () => {
        const action = doSomethingAction();

        expect(action).toEqual({
          type: DO_SOMETHING,
          payload: { thing: 'new thing' },
        });
      });

      it('handler - updates thing key', () => {
        const action = doSomethingAction('test thing');
        const stateBefore = {
          thing: 'before thing',
        };
        const stateAfter = {
          thing: 'test thing',
        };

        const reducer = somethingReducer(stateBefore, action);
        expect(reducer).toEqual(stateAfter);
      });
    });
  });
});
