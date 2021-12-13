import createStore from 'teaful';

let { useStore } = createStore({
  token: '',
  surveys: [],
  surveyInFocus: {},
  stores: [],
  products: [],
});

export {
  useStore
};
