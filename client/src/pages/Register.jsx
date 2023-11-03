import React, { useEffect, useState } from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import { FaFacebookF } from "react-icons/fa";
import FadeLoader from "react-spinners/FadeLoader";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineGoogle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { customer_register, messageClear } from "../store/reducers/authReducer";

const Register = () => {
  const [passwordError, setPasswordError] = useState(
    "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.!"
  );
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
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
  const register = (e) => {
    e.preventDefault();
    if (!validatePassword(state.password)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.!"
      );
      return;
    }
    dispatch(customer_register(state));
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      navigate("/");
    }
  }, [successMessage, errorMessage]);

  return (
    <div>
      {loader && (
        <div className="w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]">
          <FadeLoader />
        </div>
      )}
      <Headers />
      <div className="bg-slate-200 mt-4">
        <div className="w-full justify-center items-center p-10">
          <div className="grid grid-cols-2 w-[60%] mx-auto bg-[#f6f6f6] rounded-md">
            <div className="px-8 py-8">
              <h2 className="text-center w-full text-xl text-slate-600 font-bold">
                Đăng ký
              </h2>
              <div>
                <form onSubmit={register} className="text-slate-600">
                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="name">Name</label>
                    <input
                      onChange={inputHandle}
                      value={state.name}
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                      id="name"
                      name="name"
                      placeholder="name"
                      required
                    />
                  </div>
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
                      required
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
                      className="absolute inset-y-0 text-xl right-3 flex items-center cursor-pointer mt-7 "
                    >
                      {state.showPassword ? <span>🙈</span> : <span>👁</span>}
                    </span>
                  </div>
                  {renderPasswordStrengthBar()}
                  <div className="flex justify-end m-2">
                    <Link className="text-blue-500" to="/login">
                      Quên mật khẩu ?
                    </Link>
                  </div>
                  <button
                    disabled={passwordStrength < 5}
                    className={`px-8 w-full py-2 bg-purple-500 shadow-lg hover:shadow-indigo-500/30 text-white rounded-md ${
                      passwordStrength < 5
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Đăng ký
                  </button>
                </form>
              
              </div>
              <div className="text-center text-slate-600 pt-1">
                <p>
                  Bạn đã có tài khoản ?{" "}
                  <Link className="text-blue-500" to="/login">
                    Đăng nhập
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

export default Register;
