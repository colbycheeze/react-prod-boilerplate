// @flow
// function square(n: number): number {
//   return n * n;
// }
//
// square('n')

// ------------------------------------
// Selectors
// ------------------------------------
type GlobalState = { +something: State, }
type Action = { type: string; payload: Object };
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

type State = {
  +thing: string,
  +anotherThing: string,
}
export const SOMETHING_KEY: string = 'something';
export const somethingSelector = (state: GlobalState): State => state[SOMETHING_KEY];

const actions = {};

// ------------------------------------
// DO SOMETHING
// ------------------------------------
export const DO_SOMETHING: string = `${SOMETHING_KEY}/DO_SOMETHING`;
export const doSomethingAction = (thing: ?string = 'new thing'): Action => ({
  type: DO_SOMETHING,
  payload: { thing },
});
actions[DO_SOMETHING] = (state, { payload }) => ({ ...state,
  thing: payload.thing,
});

export const doSomething = (thing: ?string): ThunkAction => async dispatch => {
  console.log('You Did something!');
  dispatch(doSomethingAction(thing));
};

// ------------------------------------
// Action Handlers & Reducer
// ------------------------------------
const initialState: State = {
  thing: 'Default Thing',
  anotherThing: 'Yep',
};

export const somethingReducer = (state: State = initialState, action: Action): State => {
  const handler = actions[action.type];

  return handler ? handler(state, action) : state;
};

export default somethingReducer;
