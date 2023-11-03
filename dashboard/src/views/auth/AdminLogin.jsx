import React, { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { admin_login, messageClear } from "../../store/Reducers/authReducer";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );
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
    dispatch(admin_login(state));
  };
  const overrideStyle = {
    display: "flex",
    margin: "0 auto",
    height: "24px",
    justifyContent: "center",
    alignItems: "center",
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/");
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="min-w-screen min-h-screen bg-[#161d31] flex justify-center items-center">
      <div className="w-[350px] text-[#d0d2d6] p-2">
        <div className="bg-[#283046] p-4 rounded-md">
          <div className="h-[70px] flex justify-center items-center">
            <div className="w-[180px] h-[50px]">
              <img
                className="w-full h-full"
                src="http://localhost:3000/images/logo.png"
                alt="hình ảnh"
              />
            </div>
          </div>
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
            <div className="flex flex-col gap-1 mb-4 relative">
              <label htmlFor="password">Mật khẩu</label>
              <input
                onChange={inputHandle}
                value={state.password}
                type={state.showPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-slate-700 bg-transparent outline-none focus:border-indigo-500 rounded-md"
                id="password"
                name="password"
                placeholder="Mật khẩu"
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
            <button
              disabled={loader ? true : false}
              className="bg-blue-500 w-full hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "Đăng nhập"
              )}
            </button>
            <div className="flex items-center mb-3 gap-3 justify-center">
              <p className="">
                Bạn là người bán  ?<Link className="text-blue-500" to="/login"> truy cập</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
