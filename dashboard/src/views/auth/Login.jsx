import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineGooglePlus, AiOutlineGithub } from "react-icons/ai";
import { FiFacebook } from "react-icons/fi";
import { CiTwitter } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { messageClear, seller_login } from "../../store/Reducers/authReducer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
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
  const submit = (e) => {
    e.preventDefault();
    dispatch(seller_login(state));
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);
  return (
    <div className="min-w-screen min-h-screen bg-[#161d31] flex justify-center items-center">
      <div className="w-[350px] text-[#d0d2d6] p-2">
        <div className="bg-[#283046] p-4 rounded-md">
          <h2 className="text-xl mb-3">
            Chào mừng đến với trang web thương mại điện tử
          </h2>
          <p className="text-sm mb-3">
            Vui lòng đăng nhập vào tài khoản của bạn và bắt đầu kinh doanh
          </p>
          <form onSubmit={submit}>
            <div className="flex flex-col w-full gap-1 mb-3">
              <label htmlFor="email">Email</label>
              <input
                onChange={inputHandle}
                value={state.email}
                className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                type="text"
                name="email"
                placeholder="Email"
                id="email"
                required
              />
            </div>
            <div className="flex flex-col w-full gap-1 mb-5">
              <label htmlFor="password">Mật khẩu</label>
              <div className="flex">
                <input
                  onChange={inputHandle}
                  value={state.password}
                  className="w-full px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                  type={passwordType}
                  name="password"
                  placeholder="Mật khẩu"
                  id="password"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    setPasswordType(showPassword ? "password" : "text");
                  }}
                  className="text-[#d0d2d6] cursor-pointer m-2"
                >
                  {showPassword ? <span>🙈</span> : <span>👁</span>}
                </button>
              </div>

            </div>
            <button
              disabled={loader ? true : false}
              className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "Đăng nhập"
              )}
            </button>
            <div className="flex items-center mb-3 gap-3 justify-center">
              <p>
                Đã có tài khoản? <Link className="text-blue-500" to="/register">Đăng ký tại đây</Link>
              </p>
            </div>
            <div className="flex items-center mb-3 gap-3 justify-center">
              <p className="">
                Bạn là quản lý ? <Link className="text-blue-500" to="/admin/login">truy cập</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
