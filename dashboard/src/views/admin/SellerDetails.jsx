import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {useSelector, useDispatch} from "react-redux";
import {
    get_seller, seller_status_update, messageClear,
} from "../../store/Reducers/sellerReducer";
import axios from "axios";
import api from "../../api/api";
import {FaEdit, FaTrash} from "react-icons/fa";
import {delete_category} from "../../store/Reducers/categoryReducer";
import {country} from "../../fun/fun";


const SellerDetails = () => {
    const navigate = new useNavigate();
    const dispatch = useDispatch();
    const {seller, successMessage} = useSelector((state) => state.seller);
    const {sellerId} = useParams();
    const [products, setProducts] = useState([]);
    const [countryData, setCountryData] = useState([])
    useEffect(() => {
        dispatch(get_seller(sellerId));
    }, [sellerId]);

    const [status, setStatus] = useState("");

    const [state, setState] = useState({
        name: "",
        email: "",
        district: "",
        sub_district: "",
        shopName: ""
    });
    const inputHandle = (e) => {
        console.log(state);
        setState({
            ...state, [e.target.name]: e.target.value,
        });
    };

    const updateSeller = () => {
        api.post("/profile-info-update", {
            name: state.name,
            email: state.email,
            district: state.district,
            sub_district: state.sub_district,
            shopName: state.shopName
        }).then((res) => {
            toast.success("Cập nhật thành công")
        }).catch((e) => {
        })
    }

    const submit = async (e) => {
        e.preventDefault();
        await api.post(`/profile-info-update/${sellerId}`, {
            name: state.name,
            email: state.email,
            district: state.district,
            sub_district: state.sub_district,
            shopName: state.shopName
        }).then((res) => {
            toast.success("Cập nhật thành công")
        }).catch((e) => {
        })

        await dispatch(seller_status_update({
            sellerId, status,
        }));
    };

    useEffect(() => {
        if (successMessage) {
            // toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage]);

    useEffect(() => {
        if (seller) {
            setStatus(seller.status);
            setSeller();
        }
    }, [seller]);


    const getCountry = async () => {
        try {
            const data = await country(); // Wait for the country function to resolve
            setCountryData(data); // Update the state with the fetched data
        } catch (error) {
            console.error(error);
        }
    };
    const setSeller = () => {
        setState({
            name: seller.name,
            email: seller.email,
            status: seller.status,
            shopName: seller.shopInfo?.shopName,
            sub_district: seller.shopInfo?.sub_district,
            district: seller.shopInfo?.district
        });
    }


    useEffect(() => {
        getCountry();
    }, []);


    const getBooks = async (id) => {
        try {
            await api
                .get("/admin/products/" + id)
                .then((data) => {
                    setProducts(data.data)
                }).catch(

                )
        } catch (err) {
        }
    }

    const deleteBooks = async (id) => {
        try {
            await api
                .delete(`/admin/products/` + id)
                .then((data) => {
                    toast.success("Xoá sản phẩm thành công !");
                    getBooks();
                }).catch(

                )
        } catch (err) {
        }
    }

    useEffect(() => {
        getBooks(sellerId)
        console.log(seller)
    }, [products && products.length])

    return (<div>
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4  bg-[#283046] rounded-md">
                <div className="w-full flex flex-wrap text-[#d0d2d6]">
                    <div className="w-3/12 flex justify-center items-center py-3">
                        <div>
                            {seller?.image ? (<img
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
                                <div className="flex gap-2 items-center justify-between">
                                    <span>Tên: </span>
                                    {/*<span>{seller?.name}</span>*/}
                                    <input value={state.name}
                                           onChange={inputHandle}
                                           name="name"
                                           className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    />

                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <span>Email: </span>
                                    {/*<span>{seller?.email}</span>*/}
                                    <input
                                        name="email"
                                        value={state?.email}
                                        onChange={inputHandle}
                                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <span>Vai trò: </span>
                                    <span>{seller?.role}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Trạng thái: </span>
                                    <span>  {seller.status === "active" ? "Kích hoạt" : seller.status === "pending" ? "Đang đợi duyệt" : seller.status === "deactive" ? "Khoá" : ""}</span>
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
                                <div className="flex gap-2 items-center justify-between">
                                    <span>Tên cửa hàng: </span>
                                    {/*<span>{seller?.shopInfo?.shopName}</span>*/}
                                    <input value={state?.shopName}
                                           name="shopName"
                                           onChange={inputHandle}
                                           className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    />

                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <span>Tỉnh/Thành phố: </span>
                                    <select
                                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                        name="district"
                                        required
                                        id=""
                                        onChange={inputHandle}
                                        value={state?.district}
                                    >
                                        {countryData.map((item) => <>
                                            <option value={item.name}>{item.name}</option>

                                        </>)}
                                    </select>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <span>Địa chỉ cụ thể: </span>
                                    <input value={state?.sub_district}
                                           onChange={inputHandle}
                                           name="sub_district"
                                           className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <form>
                        {/*<form onSubmit={submit}>*/}
                        <div className="flex gap-4 py-3 ">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                name=""
                                required
                                id=""
                            >
                                <option value="">--chọn trạng thái--</option>
                                <option value="active">Kích hoạt</option>
                                <option value="deactive">Khoá</option>
                            </select>
                            <button
                                onClick={submit}
                                className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 w-[170px] ">
                                Cập nhật
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(-1)
                                }}
                                className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 w-[170px] ">
                                Trở về
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div className="px-2 lg:px-7  pt-5">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-[#d0d2d6]">
                    <thead className="text-xs text-[#d0d2d6] uppercase border-b border-slate-700">
                    <tr>
                        <th scope="col" className="py-3 px-4">
                            No
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Tên
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Danh mục
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Tác giả
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Số lượng
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Trạng thái
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody className="text-sm font-normal">
                    {products && products
                        .map((d, i) => (<tr key={i}>
                            <td
                                scope="row"
                                className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                                {i + 1}
                            </td>
                            <td
                                scope="row"
                                className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                                <span>{d.name}</span>
                            </td>
                            <td
                                scope="row"
                                className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                                <span>{d.category}</span>
                            </td>
                            <td
                                scope="row"
                                className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                                <span>{d.brand}</span>
                            </td>
                            <td
                                scope="row"
                                className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                                <span>{d.stock === 0 ? "Hết hàng" : d.stock}</span>
                            </td>
                            <td
                                scope="row"
                                className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                                <span>{d.status === true ? "Hiển thị" : "Ẩn"}</span>
                            </td>
                            {/*<td*/}
                            {/*    scope="row"*/}
                            {/*    className="py-1 px-4 font-medium whitespace-nowrap"*/}
                            {/*>*/}
                            {/*    <div>*/}
                            {/*        <form*/}
                            {/*            // onSubmit={submit}*/}
                            {/*        >*/}
                            {/*            <div className="flex gap-4 py-3">*/}
                            {/*                <select*/}
                            {/*                    // value={status}*/}
                            {/*                    onChange={(e) => {*/}
                            {/*                        setStatus({*/}
                            {/*                            status: e.target.value, _id: d._id,*/}
                            {/*                        });*/}
                            {/*                    }}*/}
                            {/*                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"*/}
                            {/*                    name=""*/}
                            {/*                    required*/}
                            {/*                    id=""*/}
                            {/*                >*/}
                            {/*                    <option value="">--Cập nhật trạng thái--</option>*/}
                            {/*                    <option value={true}>Hển thị</option>*/}
                            {/*                    <option value={false}>Ẩn</option>*/}
                            {/*                </select>*/}
                            {/*            </div>*/}
                            {/*        </form>*/}
                            {/*    </div>*/}
                            {/*</td>*/}
                            <td>
                                <td
                                    scope="row"
                                    className="py-1 px-4 font-medium whitespace-nowrap"
                                >
                                    <div className="flex justify-start items-center gap-4">
                                        <Link
                                            to={`/admin/dashboard/edit-product/${d._id}`}
                                            className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                                        >
                                            <FaEdit/>
                                        </Link>
                                        <span
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                await deleteBooks(d._id)
                                            }}
                                            className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer">
                            <FaTrash/>
                          </span>
                                    </div>
                                </td>
                            </td>
                        </tr>))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>);
};

export default SellerDetails;
