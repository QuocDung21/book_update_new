const customerModel = require("../../models/customerModel");
const { responseReturn } = require("../../utiles/response");
const { createToken } = require("../../utiles/tokenCreate");
const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const sendEmail = require("../../mail/mail");
var keygen = require("keygen");
const bcrypt = require("bcrypt");
const cron = require("../../utiles/cron");
const keyResetModel = require("../../models/keyResetModel");

class customerAuthController {
  customer_block = async (req, res, next) => {
    try {
      const { email } = req.params;
      const customer = await customerModel.findOne({ email });
      if (!customer) {
        responseReturn(res, 500, { message: "Người dùng không tồn tại" });
      }
      await customerModel.updateOne({ email }, { status: false });
      responseReturn(res, 200, {
        message:
          "Người dùng đã bị khóa do đăng nhập sai quá 5 lần vui lòng liên hệ Admin để mở khóa !!",
      });
    } catch (error) {
      responseReturn(res, 404, { error: error.message });
    }
  };

  customer_ResetPassword = async (req, res) => {
    const { key, email, newPassword } = req.body;
    await cron.start();
    try {
      const auth = await keyResetModel.findOne({ key });
      if (!auth) {
        return responseReturn(res, 201, { message: "Mã đã hết hạn" });
      }
      await customerModel.findOneAndUpdate(
        { email },
        {
          password: await bcrypt.hash(newPassword, 10),
        }
      );
      console.log({ key, email, newPassword });
      responseReturn(res, 200, { message: "Cập nhật mật khẩu thành công" });
    } catch (error) {
      console.log(error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };

  customer_resetPassword_sendEmail = async (req, res) => {
    const { email } = req.params;
    let key = keygen.url(keygen.medium);
    try {
      const checkCustomer = await customerModel.find({ email });
      if (!checkCustomer) {
        return responseReturn(res, 500, { error: "Email chưa đăng ký" });
      }
      await sendEmail(
        email,
        "Cập nhật mật khẩu",
        "Cập nhật mật khẩu",
        `<p>Mã của bạn là : ${key}, Lưu ý chỉ tồn tại 2 phút</p>`
      ).then(async (result) => {
        if (result) {
          await keyResetModel.create({
            key,
          });
          console.log("Email đã được gửi thành công");
          cron.start();
        } else {
          console.log("Gửi email thất bại");
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  customer_changePassword = async (req, res) => {
    const { email, password, oldPassword } = req.body;
    try {
      const customer = await customerModel
        .findOne({ email })
        .select("+password");
      const match = await bcrypt.compare(oldPassword, customer.password);

      if (match) {
        await customerModel.findByIdAndUpdate(customer._id, {
          password: await bcrypt.hash(password, 10),
        });
        responseReturn(res, 200, { message: "Đổi mật khẩu thành công" });
      }
      responseReturn(res, 201, { message: "Mật khẩu cũ không đúng" });
    } catch (error) {
      // responseReturn(res, 500, { message: error.message });
    }
  };

  customer_status = async (req, res) => {
    const { status, email } = req.body;
    console.log(req.body);
    try {
      const user = await customerModel.findOne({ email });
      if (!user) {
        responseReturn(res, 500, { message: "Người dùng không tồn tại" });
      }
      await customerModel.updateOne({ email }, { status: status });
      responseReturn(res, 200, {
        message: `Cập nhật trạng thái người dùng thành công `,
      });
    } catch (error) {
      console.log(error);
      responseReturn(res, 404, { error: error.message });
    }
  };

  customer_register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const customer = await customerModel.findOne({ email });
      if (customer) {
        responseReturn(res, 404, { error: "Email đã tồn tại" });
      } else {
        const createCustomer = await customerModel.create({
          name: name.trim(),
          email: email.trim(),
          password: await bcrypt.hash(password, 10),
          method: "menualy",
        });
        await sellerCustomerModel.create({
          myId: createCustomer.id,
        });
        const token = await createToken({
          id: createCustomer.id,
          name: createCustomer.name,
          email: createCustomer.email,
          method: createCustomer.method,
        });
        res.cookie("customerToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 201, { message: "Đăng ký thành công", token });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  customer_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const customer = await customerModel
        .findOne({ email })
        .select("+password");
      if (customer && customer.status === false) {
        responseReturn(res, 500, {
          error: "Tài khoản đã bị khóa vui lòng liên hệ admin để mở !",
        });
      }
      if (customer) {
        const match = await bcrypt.compare(password, customer.password);
        if (match) {
          const token = await createToken({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            method: customer.method,
          });
          res.cookie("customerToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 201, {
            message: "Đăng nhập thành công",
            token,
            status: customer?.status,
          });
        } else {
          responseReturn(res, 404, { error: "Sai mật khẩu" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  customer_logout = async (req, res) => {
    res.cookie("customerToken", "", {
      expires: new Date(Date.now()),
    });
    responseReturn(res, 200, { message: "Đăng xuất thành công" });
  };
}

module.exports = new customerAuthController();
