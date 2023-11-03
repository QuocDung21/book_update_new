import React, {useEffect, useState} from "react";
import {FaEdit, FaEye, FaTrash} from "react-icons/fa";
import {Link} from "react-router-dom";
import Pagination from "../Pagination";
import {useDispatch, useSelector} from "react-redux";
import {get_active_sellers} from "../../store/Reducers/sellerReducer";
import api from "../../api/api";
import toast from "react-hot-toast";
import {delete_category} from "../../store/Reducers/categoryReducer";

const Sellers = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const {sellers, totalSellers} = useSelector((state) => state.seller);


    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage), page: parseInt(currentPage), searchValue,
        };
        dispatch(get_active_sellers(obj));
    }, [searchValue, currentPage, parPage]);

    const deleteSeller = async (id) => {
        try {
            await api.delete("/delete-seller/" + id).then((res) => {
                toast.success("Xoá seller thành công")
                const obj = {
                    parPage: parseInt(parPage), page: parseInt(currentPage), searchValue,
                };
                dispatch(get_active_sellers(obj));
                console.log(res);
            }).catch((e) => {
                console.log(e)
                toast.error("Xoá thất bại")
            })
        } catch (e) {

        }
    }

    console.log(sellers)

    return (<div className="px-2 lg:px-7 pt-5">
        <div className="w-full p-4  bg-[#283046] rounded-md">
            <div className="flex justify-between items-center">
                <select
                    onChange={(e) => {
                        console.log(e.target.value)
                        setParPage(parseInt(e.target.value))
                    }}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                >
                    <option value="5">5</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                </select>
                <input
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    placeholder="Tìm kiếm"
                />
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-[#d0d2d6]">
                    <thead className="text-xs text-[#d0d2d6] uppercase border-b border-slate-700">
                    <tr>
                        <th scope="col" className="py-3 px-4">
                            STT
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Hình ảnh
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Tên
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Tên cửa hàng
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Trạng thái
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Email
                        </th>
                        <th scope="col" className="py-3 px-4">
                          Tỉnh/Thành Phố
                        </th>
                        <th scope="col" className="py-3 px-4">
                         Địa chỉ chi tiết
                        </th>
                        <th scope="col" className="py-3 px-4">
                            Hành động
                        </th>
                    </tr>
                    </thead>
                    <tbody className="text-sm font-normal">
                    {sellers.map((d, i) => (<tr key={i}>
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
                            <img
                                className="w-[45px] h-[45px]"
                                src={d.image ? `${d.image}` : "https://www.shareicon.net/data/512x512/2016/08/05/806962_user_512x512.png"}
                                alt=""
                            />
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
                            <span>{d.shopInfo?.shopName}</span>
                        </td>
                        <td
                            scope="row"
                            className="py-1 px-4 font-medium whitespace-nowrap"
                        >
                            <span >

                                        {d.status === "active" ? "Kích hoạt" : d.status === "pending" ? "Đang đợi duyệt" : d.status === "deactive" ? "Khoá" : ""}
                                      </span>
                        </td>
                        <td
                            scope="row"
                            className="py-1 px-4 font-medium whitespace-nowrap"
                        >
                            <span>{d.email}</span>
                        </td>
                        <td
                            scope="row"
                            className="py-1 px-4 font-medium whitespace-nowrap"
                        >
                            <span>{d.shopInfo?.district}</span>
                        </td>
                        <td
                            scope="row"
                            className="py-1 px-4 font-medium whitespace-nowrap"
                        >
                            <span>{d.shopInfo?.sub_district}</span>
                        </td>
                        <td
                            scope="row"
                            className="py-1 px-4 font-medium whitespace-nowrap"
                        >
                            <div className="flex justify-start items-center gap-4">
                                <Link
                                    to={`/admin/dashboard/seller/details/${d._id}`}
                                    className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                                >
                                    <FaEye/>
                                </Link>
                                <span
                                    onClick={(e) => {
                                        e.preventDefault()
                                        deleteSeller(d._id)
                                        // dispatch(delete_category(d._id));
                                    }}
                                    className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer"
                                >
                            <FaTrash/>
                          </span>
                            </div>

                        </td>
                    </tr>))}
                    </tbody>
                </table>
            </div>
            {totalSellers <= parPage ? (<div className="w-full flex justify-end mt-4 bottom-4 right-4">
                <Pagination
                    pageNumber={currentPage}
                    setPageNumber={setCurrentPage}
                    totalItem={totalSellers}
                    parPage={parPage}
                    showItem={4}
                />
            </div>) : ("")}
        </div>
    </div>);
};

export default Sellers;
