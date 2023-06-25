import { useReducer } from "react";

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

const mergeStateReducer = <T>(state: T, newState: T) => ({
  ...state,
  ...newState,
});

export const useMergeState = <T>(initialState: T) => {
  const [state, dispatch] = useReducer(mergeStateReducer, initialState);
  const setState = (newState: DeepPartial<T>) => dispatch(newState);
  return [state as T, setState] as const;
};
