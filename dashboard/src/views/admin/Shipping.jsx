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
import {country, getFun, formatCurrency} from "../../fun/fun";
import api from "../../api/api";

const Category = () => {
    const dispatch = useDispatch();
    const {loader, successMessage, errorMessage, categorys} = useSelector((state) => state.category);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState(false);
    const [imageShow, setImage] = useState("");
    const [countryData, setCountryData] = useState([])
    const [state, setState] = useState({
        city: "", price: "",
    });
    const [statusFrom, setStatusFrom] = useState(0);

    const [shipping, setShipping] = useState([])
    const imageHandle = (e) => {
        let files = e.target.files;
        if (files.length > 0) {
            setImage(URL.createObjectURL(files[0]));
            setState({
                ...state, image: files[0],
            });
        }
    };


    const handleEdit = (price, city) => {
        setState({
            price,
            city
        })
    }

    const getCountry = async () => {
        try {
            const data = await country(); // Wait for the country function to resolve
            setCountryData(data); // Update the state with the fetched data
        } catch (error) {
            console.error(error);
        }
    };

    const clearState = () => {
        setState({
            city: "", price: "",
        });
    };


    const add_category = (e) => {
        e.preventDefault();
        if (statusFrom == 0) {
            dispatch(categoryAdd(state));
        } else {
            dispatch(categoryUpdate(state));
        }
    };

    const handleDelete = async (id) => {
        await api.delete(`/shipping/${id}`)
            .then((response) => {
                toast.success("Xoá thành công")
                getData()
            }).catch((error) => {
                console.log(error);
            });
    }

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

    const getData = async () => {
        await api.get("/shipping").then((response) => {
            return setShipping(response.data)
        }).catch((error) => {

        })
    }

    useEffect(() => {
        getCountry()
        getData()
    }, []);

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

    const inputHandle = (e) => {
        console.log(state);
        setState({
            ...state, [e.target.name]: e.target.value,
        });
    };


    const handleUpdate = async () => {
        try {
            await api.post("/shipping", {
                city: state.city,
                price: state.price
            }).then(response => {
                toast.success("Cập nhật thành công")
                getData()
            }).catch((error) => {

            })
        } catch (e) {

        }
    }


    const onChange = (checked) => {
        setState((prevState) => ({
            ...prevState, status: checked,
        }));
    };
    return (<div className="px-2 lg:px-7 pt-5">
        <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
            <h1 className="text-[#d0d2d6] font-semibold text-lg">Danh mục</h1>
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
                                    Tỉnh/Thành Phố
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Phí
                                </th>
                                <th scope="col" className="py-3 px-4">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {shipping.map((d, i) => (<tr key={i}>
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
                                        <span>{d.city}</span>
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        <span>{formatCurrency(d.price)}</span>
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-1 px-4 font-medium whitespace-nowrap"
                                    >
                                        <div className="flex justify-start items-center gap-4">
    <span
        onClick={(e) => {
            e.preventDefault();
            handleEdit(d.price, d.city)
        }}
        title="editor"
        className="cursor-pointer p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
    >
                            <FaEdit/>
                          </span>
                                            {/* Remove */}
                                            <span
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDelete(d._id);
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
                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={50}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                </div>
            </div>
            <div
                className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${show ? "right-0" : "-right-[340px]"} z-[9999] top-0 transition-all duration-500`}
            >
                <div className="w-full pl-5">
                    <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
                        <div className="flex justify-between items-center mb-4">
                            <div
                                onClick={() => setShow(false)}
                                className="block lg:hidden cursor-pointer"
                            >
                                <GrClose className="text-[#d0d2d6]"/>
                            </div>
                        </div>
                        <form>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <span>Tỉnh/Thành phố: </span>
                                <select
                                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    name="city"
                                    onChange={inputHandle}
                                    value={state.city}
                                    required
                                    id=""
                                >
                                    {countryData.map((item) => <>
                                        <option value={item.name}>{item.name}</option>
                                    </>)}
                                </select>
                            </div>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <label htmlFor="name">Phí </label>
                                <input
                                    value={state.price}
                                    onChange={inputHandle}
                                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                                    type="text"
                                    id="name"
                                    name="price"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdate()
                                    }}
                                    className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                                >
                                    Cập nhật
                                </button>
                                {statusFrom == 1 && (<button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        clearState();
                                        setStatusFrom(0);
                                    }}
                                    className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                                >
                                    Hủy
                                </button>)}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default Category;
