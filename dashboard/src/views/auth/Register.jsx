import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineGooglePlus, AiOutlineGithub } from "react-icons/ai";
import { FiFacebook } from "react-icons/fi";
import { CiTwitter } from "react-icons/ci";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { overrideStyle } from "../../utils/utils";
import {
  messageClear,
  seller_register,
} from "../../store/Reducers/authReducer";

const Register = () => {

  const [passwordError, setPasswordError] = useState(
    "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.!"
  );
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );
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
  const submit = (e) => {
    e.preventDefault();
    if (!validatePassword(state.password)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.!"
      );
      return;
    }
    dispatch(seller_register(state));
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
            Vui lòng đăng ký tài khoản của bạn và bắt đầu kinh doanh của bạn
          </p>
          <form onSubmit={submit}>
            <div className="flex flex-col w-full gap-1 mb-3">
              <label htmlFor="name">Họ và tên</label>
              <input
                onChange={inputHandle}
                value={state.name}
                className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                type="text"
                name="name"
                placeholder="Họ và tên"
                id="name"
                required
              />
            </div>
            <div className="flex flex-col w-full gap-1 mb-3">
              <label htmlFor="email">Email</label>
              <input
                onChange={inputHandle}
                value={state.email}
                className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                type="email"
                name="email"
                placeholder="Email"
                id="email"
                required
              />
            </div>
            <div className="flex flex-col w-full gap-1 mb-3">
              <label htmlFor="password">Mật khẩu</label>
              <input
                onChange={inputHandle}
                value={state.password}
                className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                type="password"
                name="password"
                placeholder="Mật khẩu"
                id="password"
                required
              />
            </div>
            {renderPasswordStrengthBar()}
            <div className="flex items-center w-full gap-3 mb-3">
              <input
                className="w-4 h-4 text-blue-600 overflow-hidden bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                type="checkbox"
                name="checkbox"
                id="checkbox"
                required
              />
              <label htmlFor="checkbox">
                Tôi đồng ý với chính sách bảo mật và điều khoản sử dụng
              </label>
            </div>
            <button
              disabled={loader ? true : false}
              className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "Đăng ký"
              )}
            </button>
            <div className="flex items-center mb-3 gap-3 justify-center">
              <p>
                Đã có tài khoản? <Link className="text-blue-500" to="/login">Đăng nhập ở đây</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
