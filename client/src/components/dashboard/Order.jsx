import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {get_order} from "../../store/reducers/orderReducer";
import {formatCurrency} from "../../fun/fun";

const Order = () => {
    const {orderId} = useParams();
    const dispatch = useDispatch();
    const {myOrder} = useSelector((state) => state.order);
    const {userInfo} = useSelector((state) => state.auth);
    console.log(myOrder);

    useEffect(() => {
        dispatch(get_order(orderId));
    }, [orderId]);

    return (
        <div className="bg-white p-5">
      <span className=" text-slate-600 font-semibold ">
        Ngày đặt : {myOrder.date}
      </span>
            <hr className="my-5"/>
            <h2 className="text-slate-600 font-semibold"> Mã đơn : #{myOrder._id}</h2>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-slate-600 font-semibold">
                        Giao tới: {myOrder.shippingInfo?.name}
                    </h2>
                    <p>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Địa chỉ Nhà
            </span>
                        <span className="text-slate-600 text-sm">
              {myOrder.shippingInfo?.address} {myOrder.shippingInfo?.province}{" "}
                            {myOrder.shippingInfo?.city} {myOrder.shippingInfo?.area}
            </span>
                    </p>
                    <p className="text-slate-600 text-sm font-semibold">
                        Email : {userInfo.email}
                    </p>
                </div>
                <div className="text-slate-600">
                    <h2>Giá: {formatCurrency(myOrder.price)} bao gồm phí vận chuyển</h2>
                    <p>
                        Trạng thái thanh toán:{" "}
                        <span
                            className={`py-[1px] text-xs px-3 ${
                                myOrder.payment_status === "Đã thanh toán"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            } rounded-md `}
                        >
              {myOrder.payment_status}
            </span>
                    </p>
                    <p>
                        Trạng thái đơn hàng:{" "}
                        <span
                            className={`py-[1px] text-xs px-3 ${
                                myOrder.delivery_status === "Giao Hàng Thành Công"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-red-100 text-red-800"
                            } rounded-md `}
                        >
              {myOrder.delivery_status == "placed" ? "Đã đặt" : myOrder.delivery_status}
            </span>
                    </p>
                </div>
            </div>
            <div className="mt-3">
                <h2 className="text-slate-600 text-lg pb-2">Sản phẩm</h2>
                <div className="flex gap-5 flex-col">
                    {myOrder.products?.map((p, i) => (
                        <div key={i}>
                            <div className="flex gap-5 justify-start items-center text-slate-600">
                                <div className="flex gap-2">
                                    <img
                                        className="w-[55px] h-[55px]"
                                        src={p.images[0] ? p.images[0] : "https://icons8.com/preloaders/img/ajax-loader-preview.png"}
                                        alt="image"
                                    />
                                    <div className="flex text-sm flex-col justify-start items-start">
                                        <Link>Tên sản phẩm : {p.name}</Link>
                                        <p>
                                            <span>Thương hiệu: {p.brand}</span>
                                            <br/>
                                            <span>Số lượng : {p.quantity}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="pl-4">
                                    <h2 className="text-md text-orange-500">
                                        Giá sau khi giảm
                                        : {formatCurrency(p.price - Math.floor((p.price * p.discount) / 100))}
                                    </h2>
                                    <p>Giá : {p.price}</p>
                                    <p>Giảm : -{p.discount}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Order;
