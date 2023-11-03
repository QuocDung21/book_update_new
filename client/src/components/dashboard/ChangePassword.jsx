import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [state, setState] = useState({
    email: userInfo?.email,
    password: "",
    oldPassword: "",
  });
  const handle_changePassword = async (e) => {
    await api
      .post(
        "/customer/change-password",
        {
          password: state.password,
          email: userInfo?.email,
          oldPassword: state.oldPassword,
        },
        { withCredentials: true }
      )
      .then((result) => {
        console.log(result.status);
        if (result.status === 200) {
          toast.success("Đổi mật khẩu thành công");
        } else if (result.status === 201) {
          toast.error("Mật khẩu cũ không đúng");
        }
      })
      .catch((err) => {
        toast.success("Mật khẩu cũ không đúng");
      });
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

  const [passwordStrength, setPasswordStrength] = useState(0);

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

  return (
    <div className="p-4 bg-white">
      <h2 className="text-xl text-slate-600 pb-5">Đổi mật khẩu</h2>
      <form>
        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="old_password">Mật khẩu cũ</label>
          <input
            type="password"
            id="oldPassword"
            onChange={inputHandle}
            name="oldPassword"
            className="outline-none px-3 py-1 border rounded-md text-slate-600"
          />
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="new_password">Mật khẩu mới</label>
          <input
            id="password"
            name="password"
            onChange={inputHandle}
            className="outline-none px-3 py-1 border rounded-md text-slate-600"
          />
          {renderPasswordStrengthBar()}
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!validatePassword(state.password)) {
                toast.error(
                  "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.!"
                );
                return;
              }
              handle_changePassword();
            }}
            className="px-8 py-2 bg-purple-500 shadow-lg hover:shadow-purple-500/30 text-white rounded-md"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
