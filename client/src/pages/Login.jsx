import React, { useState, useEffect } from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import { FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineGoogle } from "react-icons/ai";
import FadeLoader from "react-spinners/FadeLoader";
import { useSelector, useDispatch } from "react-redux";
import {
  customer_block,
  customer_login,
  messageClear,
} from "../store/reducers/authReducer";
import toast from "react-hot-toast";
import api from "../api/api";

const Login = () => {
  const { loader, successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const login = async (e) => {
    e.preventDefault();
    if (failedAttempts >= 3) {
      await dispatch(customer_block(state.email));
      toast.error("Tài khoản đã bị khóa do nhập sai quá 5 lần");
      return;
    }
    dispatch(customer_login(state));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      setFailedAttempts((prevAttempts) => prevAttempts + 1);
      if (failedAttempts + 1 >= 5) {
        toast.error("Tài khoản đã bị khóa do nhập sai quá 5 lần");
        dispatch(messageClear());
        return;
      }
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      navigate("/");
    }
  }, [successMessage, errorMessage]);

  const resetPassword = async (email) => {
    await api.get(`/customer/reset-pass/${email}`);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (!state.email) return toast.error("Vui lòng nhập Email");
    // Send email to user
    resetPassword(state.email);
    toast.success(state.email);
  };

  return (
    <div>
      <Headers />
      {loader && (
        <div className="w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]">
          <FadeLoader />
        </div>
      )}
      <div className="bg-slate-200 mt-4">
        <div className="w-full justify-center items-center p-10">
          <div className="grid grid-cols-2 w-[60%] mx-auto bg-[#f6f6f6] rounded-md">
            <div className="px-8 py-8">
              <h2 className="text-center w-full text-xl text-slate-600 font-bold">
                Đăng nhập
              </h2>
              <div>
                <form onSubmit={login} className="text-slate-600">
                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="email">Email</label>
                    <input
                      onChange={inputHandle}
                      value={state.email}
                      type="email"
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                      id="email"
                      name="email"
                      placeholder="email"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mb-4 relative">
                    <label htmlFor="password">Password</label>
                    <input
                      onChange={inputHandle}
                      value={state.password}
                      type={state.showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 pr-10 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                      id="password"
                      name="password"
                      placeholder="password"
                    />
                    <span
                      onClick={() =>
                        setState((prevState) => ({
                          ...prevState,
                          showPassword: !prevState.showPassword,
                        }))
                      }
                      className="absolute inset-y-0 right-3 text-xl flex items-center cursor-pointer mt-7 "
                    >
                      {state.showPassword ? <span>🙈</span> : <span>👁</span>}
                    </span>
                  </div>

                  <div className="flex justify-end m-2">
                    <Link to={"/resetPassword"} className="text-blue-500">
                      Quên mật khẩu ?
                    </Link>
                  </div>
                  <button className="px-8 w-full py-2 bg-purple-500 shadow-lg hover:shadow-indigo-500/30 text-white rounded-md">
                    Đăng nhập
                  </button>
                </form>
                <div className="flex justify-center items-center py-2">
                  <div className="h-[1px] bg-slate-300 w-[95%]"></div>
                  <span className="px-3 text-slate-600">or</span>
                  <div className="h-[1px] bg-slate-300 w-[95%]"></div>
                </div>
              </div>
              <div className="text-center text-slate-600 pt-1">
                <p>
                  Bạn chưa có tài khoản ?{" "}
                  <Link className="text-blue-500" to="/register">
                    Đăng ký
                  </Link>
                </p>
              </div>
            </div>
            <div className="w-full h-full py-4 pr-4">
              <img
                className="w-full h-[95%]"
                src="https://i.pinimg.com/736x/23/a1/26/23a1262a35771c54783dcc1ad6ddc0d0.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
