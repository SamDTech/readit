import axios from "axios";
import { createContext, useContext, useReducer, useEffect } from "react";
import { User } from "../types";

interface State {
  authenticated: Boolean;
  user: User | undefined;
  loading: Boolean;
}

interface Action {
  type: string;
  payload?: any;
}

const StateContext = createContext<State>({
  authenticated: false,
    user: null,
  loading: true
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };

      case "STOP_LOADING":
          return{
              ...state, loading: false
          }

    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };

    default:
      throw new Error(`Unknown action type ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
      authenticated: false,
    loading: true
  });

  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/auth/me");

        dispatch("LOGIN", data);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch("STOP_LOADING");
      }
    };

    fetchUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
