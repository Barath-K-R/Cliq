// useLogout.js
import { useSelector, useDispatch } from "react-redux";
import { authApi } from "../api/authApi.js";

const useLogout = () => {
  console.log("logout");
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.tokens.accessToken);
  const refreshToken = useSelector((state) => state.tokens.refreshToken);
  const authUser = useSelector((state) => state.user.authUser);
  const logout = async () => {
    try {
      await authApi.post("/logout", authUser);
      dispatch({
        type: "CLEAR_TOKENS",
      });

      dispatch({ type: "REMOVE_USER" });
      dispatch({ type: "RESET" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return logout;
};

export default useLogout;
