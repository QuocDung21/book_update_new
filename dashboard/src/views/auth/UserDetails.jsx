import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {useSelector, useDispatch} from "react-redux";
import {
    get_seller, seller_status_update, messageClear,
} from "../../store/Reducers/sellerReducer";
import axios from "axios";
import api from "../../api/api";
import {FaEdit, FaTrash} from "react-icons/fa";
import {delete_category} from "../../store/Reducers/categoryReducer";
import {country, formatCurrency, getFun} from "../../fun/fun";
import {MdKeyboardArrowDown} from "react-icons/md";

const UserDetails = () => {
    const dispatch = useDispatch();
    const {seller, successMessage} = useSelector((state) => state.seller);
    const [userData, setUserData] = useState([])

    const {userId} = useParams();
    const [products, setProducts] = useState([null]);
    const [countryData, setCountryData] = useState([])
    const [orderData, setOrderData] = useState([])

    const [show, setShow] = useState("");
    const getCountry = async () => {
        try {
            const data = await country(); // Wait for the country function to resolve
            setCountryData(data); // Update the state with the fetched data
        } catch (error) {
            console.error(error);
        }
    };

    const [status, setStatus] = useState("");


    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage]);


    const getData = async () => {
        try {
            const user = await getFun("/get-user/", userId);
            await setUserData(user.userInfo);
            await setOrderData(user.order)
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getData();
        getCountry();
    }, [])


    return (<div>
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4  bg-[#283046] rounded-md">
                <div className="w-full flex flex-wrap text-[#d0d2d6]">
                    <div className="w-3/12 flex justify-center items-center py-3">
                        <div>
                            {userData?.image ? (<img
                                className="w-full h-[230px]"
                                src="https://www.shareicon.net/data/512x512/2016/08/05/806962_user_512x512.png"
                                alt=""
                            />) : (<span>Không có hình ảnh</span>)}
                        </div>
                    </div>
                    <div className="w-4/12">
                        <div className="px-0 md:px-5 py-2">
                            <div className="py-2 text-lg">
                                <h2>Thông Tin Cơ Bản</h2>
                            </div>
                            <div
                                className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                                <div className="flex gap-2">
                                    <span>Tên: </span>
                                    <span>{userData?.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Email: </span>
                                    <span>{userData?.email}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Trạng thái: </span>
                                    <span>{userData?.status == true ? "Kích hoạt" : "Chưa kích hoạt"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-4/12">
                        <div className="px-0 md:px-5 py-2">
                            <div className="py-2 text-lg">
                                <h2>Địa chỉ</h2>
                            </div>
                            <div
                                className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                                <div className="flex gap-2">
                                    <span>Tên cửa hàng: </span>
                                    <span>{seller?.shopInfo?.shopName}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span>Tỉnh/Thành phố: </span>
                                    <span>{seller?.shopInfo?.district}</span>
                                    <select
                                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                        name=""
                                        required
                                        id=""
                                    >
                                        {countryData.map((item) => <>
                                            <option value={false}>{item.name}</option>

                                        </>)}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <span>Địa chỉ cụ thể : </span>
                                    <span>{seller?.shopInfo?.sub_district}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                </div>
            </div>
        </div>

        <div className="px-2 lg:px-7  pt-5">
            <div className="relative mt-5 overflow-x-auto">
                <div className="w-full text-sm text-left [#d0d2d6]">
                    <div className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                        <div className="flex justify-between items-start">
                            <div className="py-3 w-[25%]">Mã đơn hàng</div>
                            <div className="py-3 w-[13%]">Giá</div>
                            <div className="py-3 w-[18%]">Trạng thái thanh toán</div>
                            <div className="py-3 w-[18%]">Trạng thái đơn hàng</div>
                            <div className="py-3 w-[18%]">Thao tác</div>
                            <div className="py-3 w-[8%]">
                                <MdKeyboardArrowDown/>
                            </div>
                        </div>
                    </div>
                    {orderData.map((o, i) => (
                        <div className="text-[#d0d2d6]">
                            <div className="flex justify-between items-start border-b border-slate-700">
                                <div className="py-4 w-[25%] font-medium whitespace-nowrap">
                                    {o._id}
                                </div>
                                <div className="py-4 w-[13%]">{formatCurrency(o.price)}</div>
                                <div className="py-4 w-[18%]">{o.payment_status}</div>
                                <div className="py-4 w-[18%]">{o.delivery_status != "placed" ? o.delivery_status : "Đã giao thành công"}</div>
                                <div className="py-4 w-[18%]">
                                    <Link to={`/admin/dashboard/order/details/${o._id}`}>
                                        Xem
                                    </Link>
                                </div>
                                <div
                                    onClick={(e) => setShow(o._id)}
                                    className="py-4 cursor-pointer w-[8%]"
                                >
                                    <MdKeyboardArrowDown />
                                </div>
                            </div>
                            <div
                                className={
                                    show === o._id
                                        ? "block border-b border-slate-700 bg-slate-800"
                                        : "hidden"
                                }
                            >
                                {/*{o.suborder.map((so, i) => (*/}
                                    <div className="flex justify-start items-start border-b border-slate-700">
                                        <div className="py-4 w-[25%] font-medium whitespace-nowrap pl-3">
                                            ${o._id}
                                        </div>
                                        <div className="py-4 w-[13%]">${o.price}</div>
                                        <div className="py-4 w-[18%]">{o.payment_status}</div>
                                        <div className="py-4 w-[18%]">{o.delivery_status}</div>
                                    </div>
                                {/*))}*/}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>);
};

export default UserDetails;
