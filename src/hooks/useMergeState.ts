import { useReducer } from "react";

const mergeStateReducer = <T>(state: T, newState: T) => ({
  ...state,
  ...newState,
});

export const useMergeState = <T>(initialState: T) => {
  const [state, dispatch] = useReducer(mergeStateReducer, initialState);
  const setState = (newState: Partial<T>) => dispatch(newState);
  return [state as T, setState] as const;
};
