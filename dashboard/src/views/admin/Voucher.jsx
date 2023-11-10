import React, {useEffect, useState} from "react";
import {FaEdit, FaTrash} from "react-icons/fa";
import {PropagateLoader} from "react-spinners";
import {overrideStyle} from "../../utils/utils";
import {GrClose} from "react-icons/gr";
import {Link} from "react-router-dom";
import Pagination from "../Pagination";
import {BsImage} from "react-icons/bs";
import toast from "react-hot-toast";
import {useSelector, useDispatch} from "react-redux";
import {Switch} from "antd";
import Search from "../components/Search";
import {
    categoryAdd, messageClear, get_category, delete_category, categoryUpdate,
} from "../../store/Reducers/categoryReducer";
import {get_customers} from "../../store/Reducers/customerReducer";
import {getFun} from "../../fun/fun";
import axios from "axios";
import api from "../../api/api";

const Voucher = () => {
    const dispatch = useDispatch();
    const {loader, successMessage, errorMessage, categorys} = useSelector((state) => state.category);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState(false);
    const [imageShow, setImage] = useState("");
    const [voucher, setVoucher] = useState([]);
    const [state, setState] = useState({
        name: "", status: true, image: "", id: "",
    });
    const [statusFrom, setStatusFrom] = useState(0);
    const imageHandle = (e) => {
        let files = e.target.files;
        if (files.length > 0) {
            setImage(URL.createObjectURL(files[0]));
            setState({
                ...state, image: files[0],
            });
        }
    };

    const editVoucher = (voucher) => {
        clearState();
        setStatusFrom(1);
        if (voucher) {
            setState((prevState) => ({
                ...prevState,
                name: voucher.name,
                discount: voucher.discount,
                stock: voucher.stock,
                status: voucher.status,
                date: voucher.date, // Thay "date" bằng tên thuộc tính chứa ngày hết hạn
                id: voucher._id,
            }));
        }
    };


    const isDateValid = (selectedDate) => {
        const currentDate = new Date();
        const selected = new Date(selectedDate);
        return selected >= currentDate;
    };

    const clearState = () => {
        setState({
            name: "",
            image: "",
            status: true,
            discount: "",
            stock: "",
            date: "",
            id: "",
        });
    };


    const clearForm = () => {
        clearState();
        setStatusFrom(0);
    };

    const add_category = (e) => {
        e.preventDefault();
        if (statusFrom == 0) {
            dispatch(categoryAdd(state));
        } else {
            dispatch(categoryUpdate(state));
        }
    };

    const getVoucher = async (e) => {
        await api.get("voucher").then((res) => {
            setVoucher(res.data)
        })
    }


    const deleteVoucher = async (voucherId) => {
        try {
            // Gọi hàm xoá voucher từ API hoặc Redux
            await api.delete(`voucher/${voucherId}`);
            toast.success("Voucher đã được xoá thành công!");
            getVoucher(); // Lấy danh sách voucher sau khi xoá
        } catch (error) {
            console.error("Lỗi khi xoá voucher:", error);
            toast.error("Có lỗi xảy ra khi xoá voucher.");
        }
    };


    const addVoucher = async (e) => {
        e.preventDefault();
        if (!isDateValid(state.date)) {
            toast.error("Ngày hết hạn không hợp lệ");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", state.name);
            formData.append("discount", state.discount);
            formData.append("stock", state.stock);
            formData.append("status", state.status);
            formData.append("date", state.date);

            if (statusFrom === 0) {
                // Adding a new voucher
                const response = await api.post("voucher", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                // Handle response and show toast
            } else {
                // Updating an existing voucher
                const response = await api.put(`voucher/${state.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                // Handle response and show toast
            }
            getVoucher(); // Refresh the voucher list
        } catch (error) {
            console.error("Error:", error);
            toast.error("Có lỗi xảy ra khi thêm/cập nhật voucher.");
        }
    };


    useEffect(() => {
        getVoucher();
    }, []);

    const edit_category = (data) => {
        clearState();
        setStatusFrom(1);
        if (data) {
            console.log(data);
            setState((prevState) => ({
                ...prevState, name: data.name, status: data.status, id: data._id,
            }));
        }
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setState({
                name: "", image: "", status: true,
            });
            setImage("");
        }
    }, [successMessage, errorMessage]);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage), page: parseInt(currentPage), searchValue,
        };
        dispatch(get_category(obj));
    }, [searchValue, currentPage, parPage, successMessage]);

    console.log(categorys)

    const onChange = (checked) => {
        setState((prevState) => ({
            ...prevState, status: checked,
        }));
    };
    return (<div className="px-2 lg:px-7 pt-5">
        <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
            <h1 className="text-[#d0d2d6] font-semibold text-lg">Voucher</h1>
            <button
                onClick={() => setShow(true)}
                className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
            >
                Add
            </button>
        </div>
        <div className="flex flex-wrap w-full">
            <div className="w-full lg:w-7/12">
                <div className="w-full p-4  bg-[#283046] rounded-md">
                    <Search
                        setParPage={setParPage}
                        setSearchValue={setSearchValue}
                        searchValue={searchValue}
                    />
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-[#d0d2d6]">
                            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                            <tr>
                                <th scope="col" className="py-3 px-4">
                                    No
                                </th>

                                <th scope="col" className="py-3 px-4">
                                    Mã voucher
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Giảm giá (%)
                                </th>
                                {/*<th scope="col" className="py-3 px-4">*/}
                                {/*    Số lượng*/}
                                {/*</th>*/}
                                <th scope="col" className="py-3 px-4">
                                    Ngày hết hạn
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Trạng thái
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {voucher.map((d, i) => (<tr key={i}>
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
                                    <span>{d.discount} %</span>
                                </td>
                                {/*<td*/}
                                {/*    scope="row"*/}
                                {/*    className="py-1 px-4 font-medium whitespace-nowrap"*/}
                                {/*>*/}
                                {/*    <span>{d.stock}</span>*/}
                                {/*</td>*/}
                                <td
                                    scope="row"
                                    className="py-1 px-4 font-medium whitespace-nowrap"
                                >
                                    <span>{d.date}</span>
                                </td>
                                <td
                                    scope="row"
                                    className="py-1 px-4 font-medium whitespace-nowrap"
                                >
                                    <span>{d.status === true ? "Hiện" : "Ẩn"}</span>
                                </td>
                                <td
                                    scope="row"
                                    className="py-1 px-4 font-medium whitespace-nowrap"
                                >
                                    <div className="flex justify-start items-center gap-4">
                          <span
                              onClick={(e) => {
                                  e.preventDefault();
                                  editVoucher(d);
                              }}
                              title="editor"
                              className="cursor-pointer p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                          >
                            <FaEdit/>
                          </span>
                                        {/* Remove */}
                                        <span
                                            onClick={() => {
                                                deleteVoucher(d._id);
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
                    {/*<div className="w-full flex justify-end mt-4 bottom-4 right-4">*/}
                    {/*    <Pagination*/}
                    {/*        pageNumber={currentPage}*/}
                    {/*        setPageNumber={setCurrentPage}*/}
                    {/*        totalItem={50}*/}
                    {/*        parPage={parPage}*/}
                    {/*        showItem={4}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
            </div>
            <div
                className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${show ? "right-0" : "-right-[340px]"} z-[9999] top-0 transition-all duration-500`}
            >
                <div className="w-full pl-5">
                    <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-[#d0d2d6] font-semibold text-xl">
                                Thêm voucher
                            </h1>
                            <div
                                onClick={() => setShow(false)}
                                className="block lg:hidden cursor-pointer"
                            >
                                <GrClose className="text-[#d0d2d6]"/>
                            </div>
                        </div>
                        <form onSubmit={addVoucher}>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <label htmlFor="name">Tên voucher </label>
                                <input
                                    value={state.name}
                                    onChange={(e) => setState({...state, name: e.target.value})}
                                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    type="text"
                                    id="name"
                                    name="category_name"
                                    placeholder="Tên voucher"
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <label htmlFor="discount">Discount </label>
                                <input
                                    value={state.discount}
                                    onChange={(e) => setState({...state, discount: e.target.value})}
                                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    placeholder="Discount"
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <label htmlFor="date">Ngày hết hạn</label>
                                <input
                                    value={state.date}
                                    onChange={(e) => setState({...state, date: e.target.value})}
                                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    type="date"
                                    id="date"
                                    name="date"
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <label htmlFor="stock">Stock </label>
                                <input
                                    value={state.stock}
                                    onChange={(e) => setState({...state, stock: e.target.value})}
                                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    placeholder="Stock"
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <div>
                                    <label htmlFor="">Trạng thái</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="mr-2" htmlFor="">
                                        Ẩn
                                    </label>
                                    <Switch checked={state?.status} onChange={onChange}/>
                                    <label className="ml-2" htmlFor="">
                                        Hiện
                                    </label>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    disabled={loader}
                                    className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                                    type="submit"
                                >
                                    {loader ? (
                                        <PropagateLoader color="#fff" cssOverride={overrideStyle}/>
                                    ) : statusFrom === 0 ? (
                                        "Thêm voucher"
                                    ) : (
                                        "Cập nhật voucher"
                                    )}
                                </button>
                                {statusFrom === 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            clearForm();
                                            setStatusFrom(0);
                                        }}
                                        className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                                        type="button"
                                    >
                                        Hủy
                                    </button>
                                )}
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default Voucher;
