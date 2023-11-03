import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  get_admin_order,
  admin_order_status_update,
  messageClear,
} from "../../store/Reducers/OrderReducer";
import {formatCurrency} from "../../fun/fun";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { order, errorMessage, successMessage } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(get_admin_order(orderId));
  }, [orderId]);

  const [status, setStatus] = useState("");
  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);
  const status_update = (e) => {
    dispatch(
      admin_order_status_update({ orderId, info: { status: e.target.value } })
    );
    setStatus(e.target.value);
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
  }, [successMessage, errorMessage]);

  console.log(order)

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4  bg-[#283046] rounded-md">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl text-[#d0d2d6]">Chi tiết đơn hàng</h2>
          <select
            onChange={status_update}
            value={status}
            name=""
            id=""
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
          >
            <option value="pending">Đang chờ</option>
            <option value="processing">Đang xử lý</option>
            <option value="warehouse">Trong kho</option>
            <option value="placed">Đã đặt hàng</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        <div className="p-4">
          <div className="flex gap-2 text-lg text-[#d0d2d6]">
            <h2>#{order._id}</h2>
            <span>{order.date}</span>
          </div>
          <div className="flex flex-wrap">
            <div className="w-[32%]">
              <div className="pr-3 text-[#d0d2d6] text-lg">
                <div className="flex flex-col gap-1">
                  <h2 className="pb-2 font-semibold">
                    Giao tới: {order.shippingInfo?.name}
                  </h2>
                  <p>
                    <span className="text-sm">
                      Địa chỉ: {order.shippingInfo?.address}{" "}
                      {order.shippingInfo?.province} {order.shippingInfo?.city}{" "}
                      {order.shippingInfo?.area}
                    </span>
                  </p>
                </div>
                <div className="flex justify-start items-center gap-3">
                  <h2>Tình trạng thanh toán: </h2>
                  <span className="text-base">{order.payment_status}</span>
                </div>
                <span>Giá: {formatCurrency(order?.price)}</span>
                <div className="mt-4 flex flex-col gap-8">
                  <div className="text-[#d0d2d6]">
                    {order.products &&
                      order.products.map((p, i) => (
                        <div key={i} className="flex gap-3 text-md">
                          <img
                            className="w-[45px] h-[45px]"
                            src={p.images[0] ? p.images[0] : "https://www.medievalacademy.org/global_graphics/default-store-350x350.jpg" }
                            alt=""
                          />
                          <div>
                            <h2>Tên sách : {p.name}</h2>
                            <p>
                              {/* <span>Thương hiệu: </span>
                              <span>{p.brand} </span> */}
                              <span className="text-lg">
                                Số lượng: {p.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[68%]">
              <div className="pl-3">
                <div className="mt-4 flex flex-col">
                  {order?.suborder?.map((o, i) => (
                    <div key={i + 20} className="text-[#d0d2d6] mb-6">

                      <div className="flex justify-start items-center gap-3">
                        <h2>Đơn hàng của Nhà cung cấp {i + 1}: </h2>
                        <span>{o.delivery_status}</span>
                      </div>
                      {o.products?.map((p, i) => (
                        <div className="flex gap-3 text-md mt-2">
                          <img
                            className="w-[45px] h-[45px]"
                            src={p.images[0] ? p.images[0] : "https://www.medievalacademy.org/global_graphics/default-store-350x350.jpg"}
                            alt=""
                          />
                          <div>
                            <h2>Tên sách : {p.name}</h2>
                            <p>
                              {/* <span>Tác giả: </span>
                              <span>{p.brand} </span> */}
                              <span className="text-lg">
                                Số lượng: {p.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
