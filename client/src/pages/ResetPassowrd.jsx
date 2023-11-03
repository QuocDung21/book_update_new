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

const ResetPassowrd = () => {
  const { loader, successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );
  const [passwordStrength, setPasswordStrength] = useState(0);
  const dispatch = useDispatch();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
    key: "",
  });

  const renderPasswordStrengthBar = () => {
    const strengthColors = ["red", "orange", "yellow", "lime", "green"];
    const strengthDescriptions = [
      "Rất yếu",
      "Yếu",
      "Trung bình",
      "Mạnh",
      "Rất mạnh",
    ];
    return (
      <div className="password-strength-container">
        <div className="w-full h-3 rounded bg-gray-300 mb-2">
          <div
            style={{
              width: `${(passwordStrength / 5) * 100}%`,
              backgroundColor: strengthColors[passwordStrength - 1],
            }}
            className="h-full rounded"
          ></div>
        </div>
        <div className="password-strength-description">
          {strengthDescriptions[passwordStrength - 1]}
        </div>
      </div>
    );
  };

  const validatePassword = (password) => {
    let strength = 0;
    const lengthRequirement = password.length >= 8;
    const numberRequirement = /[0-9]/.test(password);
    const lowercaseRequirement = /[a-z]/.test(password);
    const uppercaseRequirement = /[A-Z]/.test(password);
    const specialCharacterRequirement = /[@$!%*?&]/.test(password);

    if (lengthRequirement) strength++;
    if (numberRequirement) strength++;
    if (lowercaseRequirement) strength++;
    if (uppercaseRequirement) strength++;
    if (specialCharacterRequirement) strength++;

    setPasswordStrength(strength);

    return strength === 5;
  };

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
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
    await api
      .get(`/customer/reset-pass/${email}`)
      .then((result) => {
        toast.success(result.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetPass = async (obj) => {
    await api
      .post(`/customer/reset-pass`, obj)
      .then((result) => {
        console.log(result.data.message);
        toast.success(result.data.message);
      })
      .catch((err) => {
        toast.error("Lỗi");
      });
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    toast.success("Vui lòng kiểm tra email để lấy mã");
    if (!state.email) return toast.error("Vui lòng nhập Email");
    await resetPassword(state.email);
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
                    />
                  </div>
                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="email">Mã xác nhận</label>
                    <div className="flex ">
                      <input
                        onChange={inputHandle}
                        value={state.key}
                        type="text"
                        className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                        id="key"
                        name="key"
                      />
                      <button
                        onClick={handlePassword}
                        className="my-2  text-[#1da1f2]"
                      >
                        Lấy mã
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mb-4 relative">
                    <label htmlFor="password">Mật khẩu mới</label>
                    <input
                      onChange={inputHandle}
                      type={state.showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 pr-10 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                      id="password"
                      name="password"
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
                  {renderPasswordStrengthBar()}
                  <button
                    disabled={passwordStrength < 5}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!validatePassword(state.password)) {
                        toast.error(
                          "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.!"
                        );
                        return;
                      }
                      resetPass({
                        email: state.email,
                        key: state.key,
                        newPassword: state.password,
                      });
                    }}
                    className="px-8 w-full py-2 bg-purple-500 shadow-lg hover:shadow-indigo-500/30 text-white rounded-md"
                  >
                    Xác nhận
                  </button>
                </form>
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

export default ResetPassowrd;
