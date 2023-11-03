import React, {useEffect, useState} from "react";
import {FaEdit, FaEye, FaTrash} from "react-icons/fa";
import {Link} from "react-router-dom";
import Pagination from "../Pagination";
import {useDispatch, useSelector} from "react-redux";
import {get_active_sellers} from "../../store/Reducers/sellerReducer";
import {
    get_customers,
    messageClear,
    set_status,
} from "../../store/Reducers/customerReducer";
import {get_auth} from "../../store/Reducers/authReducer";
import api from "../../api/api";
import toast from "react-hot-toast";
import Search from "../components/Search";
import {deleteFun, getFun} from "../../fun/fun";

const Users = () => {
    const dispatch = useDispatch();
    const {loader, successMessage, errorMessage, customer, totalCustomers} =
        useSelector((state) => state.customer);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState(false);



    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
        };
        dispatch(get_customers(obj));
    }, [searchValue, currentPage, parPage, successMessage, totalCustomers]);

    const getUsers = async () => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
        };
        await dispatch(get_customers(obj));
    }

    const setStatus = (e) => {
        console.log(e);
        dispatch(set_status(e));
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);



    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4  bg-[#283046] rounded-md">
                <div className="flex justify-between items-center">
                    {/* <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
          >
            <option value="5">5</option>
            <option value="5">15</option>
            <option value="5">25</option>
          </select>
        */}
                    <Search
                        setParPage={setParPage}
                        setSearchValue={setSearchValue}
                        searchValue={searchValue}
                    />
                </div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-[#d0d2d6]">
                        <thead className="text-xs text-[#d0d2d6] uppercase border-b border-slate-700">
                        <tr>
                            <th scope="col" className="py-3 px-4">
                                No
                            </th>
                            <th scope="col" className="py-3 px-4">
                                Name
                            </th>
                            <th scope="col" className="py-3 px-4">
                                Email
                            </th>
                            <th scope="col" className="py-3 px-4">
                                Status
                            </th>
                            <th scope="col" className="py-3 px-4">

                            </th>
                            <th scope="col" className="py-3 px-4">
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody className="text-sm font-normal">
                        {customer.map((d, i) => (
                            <tr key={i}>
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
                                    <span>{d.email}</span>
                                </td>
                                <td
                                    scope="row"
                                    className="py-1 px-4 font-medium whitespace-nowrap"
                                >
                                    <span>{d.status === true ? "Hoạt động" : "Bị khóa"}</span>
                                </td>
                                <td
                                    scope="row"
                                    className="py-1 px-4 font-medium whitespace-nowrap"
                                >
                                    <div>
                                        <form
                                            // onSubmit={submit}
                                        >
                                            <div className="flex gap-4 py-3">
                                                <select
                                                    // value={status}
                                                    onChange={(e) =>
                                                        setStatus({
                                                            status: e.target.value,
                                                            email: d.email,
                                                        })
                                                    }
                                                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                                    name=""
                                                    required
                                                    id=""
                                                >
                                                    <option value="">--Cập nhật trạng thái--</option>
                                                    <option value={false}>Khóa</option>
                                                    <option value={true}>Mở khóa</option>
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                </td>
                                <td
                                    scope="row"
                                    className="py-1 px-4 font-medium whitespace-nowrap"
                                >
                                    <div className="flex justify-start items-center gap-4">
                                        <Link
                                            to={`/admin/dashboard/user/details/${d._id}`}
                                            className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                                        >
                                            <FaEye/>
                                        </Link>
                                        <span
                                            onClick={async (e) => {
                                                e.preventDefault()
                                                await deleteFun("/delete-user/", d._id, getUsers)
                                            }}
                                            className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer"
                                        >
                            <FaTrash/>
                          </span>
                                    </div>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {totalCustomers <= parPage ? (
                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalCustomers}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default Users;
