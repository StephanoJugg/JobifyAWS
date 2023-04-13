import * as Actions from './actions';

import { AuthData } from './contextTypes';

interface Action {
  type: string;
  payload?: any;
}

interface State extends AuthData {}

const reducer = (state: State, action: Action): State => {
  throw new Error('No matching action type found');
};

export default reducer;
