import React, {useEffect, useState} from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import {useLocation, Link, useNavigate} from "react-router-dom";
import {MdOutlineKeyboardArrowRight} from "react-icons/md";
import {useDispatch, useSelector} from "react-redux";
import {place_order} from "../store/reducers/orderReducer";
import {formatCurrency, country} from "../fun/fun";
import api from "../api/api";

const Shipping = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [countryData, setCountryData] = useState([])
    const {userInfo} = useSelector((state) => state.auth);
    const locationData = useLocation();
    const {
        state: {products, price, shipping_fee, items},
    } = useLocation();
    const [res, setRes] = useState(false);
    const [state, setState] = useState({
        name: "",
        address: "",
        phone: "",
        post: "",
        province: "",
        city: "",
        area: "",
        constShip: 0,
        ship_spend: 0.1
    });




    const [shipping, setShipping] = useState([])

    const getShipping = async () => {
        await api.get("/shipping").then((res) => {
            console.log(res)
        }).catch((error) => {
        })
    }

    const handleGetCost = async (city) => {
        await api.post(`/get-Shipping`, {
            city
        }).then(async (res) => {
            setState({
                ...state,
                constShip: res.data.price
            })
        }).catch((error) => {
            console.log(error)
        })
    }


    const inputHandle = async (e) => {

        await setState({
            ...state,
            [e.target.name]: e.target.value,
        });


    };

    const save = async (e) => {
        e.preventDefault()
        await handleGetCost(state.city)
        const {name, address, phone, post, province, city, area} = state;
        if (name && address && phone && post && city && area) {
            // if (name && address && phone && post && city ) {
            setRes(true);
        }
    };


    const getCountry = async () => {
        try {
            const data = await country(); // Wait for the country function to resolve
            setCountryData(data); // Update the state with the fetched data
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCountry()
        getShipping()

    }, []);
    const placeOrder = () => {
        dispatch(
            place_order({
                price,
                products,
                shipping_fee: (state.constShip + (state.constShip * state.ship_spend / 100)),
                shippingInfo: state,
                userId: userInfo.id,
                navigate,
                items,
            })
        );
    };

    return (
        <div>
            <Headers/>
            <section className="bg-[#eeeeee]">
                <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90] mx-auto py-16">
                    <div className="w-full flex flex-wrap">
                        <div className="w-[67%] md-lg:w-full">
                            <div className="flex flex-col gap-3">
                                <div className="bg-white p-6 shadow-sm rounded-md">
                                    {!res && (
                                        <>
                                            <h2 className="text-slate-600 font-bold pb-3">
                                                Thông tin giao hàng
                                            </h2>
                                            <form onSubmit={save}>
                                                <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="name">Họ và tên</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            value={state.name}
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="name"
                                                            placeholder="Họ và tên"
                                                            id="name"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="address">Địa chỉ</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            value={state.address}
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="address"
                                                            placeholder="Số nhà / tòa nhà / đường / khu vực"
                                                            id="address"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="phone">Số điện thoại</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            value={state.phone}
                                                            type="number"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="phone"
                                                            placeholder="Số điện thoại"
                                                            id="phone"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="post">Mã bưu điện</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            value={state.post}
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="post"
                                                            placeholder="Mã bưu điện"
                                                            id="post"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                                                    {/*<div className="flex flex-col gap-1 mb-2 w-full">*/}
                                                    {/*    <label htmlFor="province">Tỉnh / Thành phố</label>*/}
                                                    {/*    <input*/}
                                                    {/*        onChange={inputHandle}*/}
                                                    {/*        value={state.province}*/}
                                                    {/*        type="text"*/}
                                                    {/*        className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"*/}
                                                    {/*        name="province"*/}
                                                    {/*        placeholder="Tỉnh / Thành phố"*/}
                                                    {/*        id="province"*/}
                                                    {/*    />*/}
                                                    {/*</div>*/}
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <span>Tỉnh/Thành phố: </span>
                                                        <select
                                                            className="px-4 py-2  border-slate-200 outline-none border  rounded-md text-slate-600"
                                                            name="city"
                                                            required
                                                            id=""
                                                            value={state.city}
                                                            onChange={inputHandle}
                                                        >
                                                            {countryData.map((item) => <>
                                                                <option value={item.name}>{item.name}</option>

                                                            </>)}
                                                        </select>
                                                    </div>


                                                </div>
                                                <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                                        <label htmlFor="area">Ghi chú</label>
                                                        <input
                                                            onChange={inputHandle}
                                                            value={state.area}
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                                                            name="area"
                                                            placeholder="Ghi chú"
                                                            id="province"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1 mt-3 w-full">
                                                        <button
                                                            className="px-3 py-[6px] rounded-sm hover:shadow-indigo-500/20 hover:shadow-lg bg-indigo-500 text-white">
                                                            Lưu
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                    {res && (
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-slate-600 font-semibold pb-2">
                                                Giao hàng đến {state.name}
                                            </h2>
                                            <p>
                        <span className="bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                          Nhà
                        </span>
                                                <span className="text-slate-600 text-sm">
                          {state.address} {state.city}{" "}
                                                    {state.area}
                        </span>
                                                <span
                                                    onClick={() => setRes(false)}
                                                    className="text-indigo-500 cursor-pointer"
                                                >
                          {" "}
                                                    thay đổi
                        </span>
                                            </p>
                                            <p className="text-slate-600 text-sm">
                                                Email đến :
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {products.map((p, i) => (
                                    <div key={i} className="flex bg-white p-4 flex-col gap-2">
                                        <div className="flex justify-start items-center">
                                            <h2 className="text-md text-slate-600">{p.shopName}</h2>
                                        </div>
                                        {p.products.map((pt, j) => (
                                            <div key={i + 99} className="w-full flex flex-wrap">
                                                <div className="flex sm:w-full gap-2 w-7/12">
                                                    <div className="flex gap-2 justify-start items-center">
                                                        <img
                                                            className="w-[80px] h-[80px]"
                                                            src={pt.productInfo.images[0]}
                                                            alt="product image"
                                                        />
                                                        <div className="pr-4 text-slate-600">
                                                            <h2 className="text-md">{pt.productInfo.name}</h2>
                                                            <span className="text-sm">
                                Thương hiệu: {pt.productInfo.brand}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end w-5/12 sm:w-full sm:mt-3">
                                                    <div className="pl-4 sm:pl-0">
                                                        <h2 className="text-lg text-orange-500">

                                                            {formatCurrency(pt.productInfo.price -
                                                                Math.floor(
                                                                    (pt.productInfo.price *
                                                                        pt.productInfo.discount) /
                                                                    100
                                                                ))}
                                                        </h2>
                                                        <p className="line-through">
                                                            {formatCurrency(pt.productInfo.price)}
                                                        </p>
                                                        <p>-{pt.productInfo.discount}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-[33%] md-lg:w-full">
                            <div className="pl-3 md-lg:pl-0">
                                <div className="bg-white font-medium p-5 text-slate-600 flex flex-col gap-3">
                                    <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>
                                    <div className="flex justify-between items-center">
                                        <span>Phụ thu vận chuyển</span>
                                        <span>{formatCurrency(Math.floor(
                                            (state.constShip *
                                                state.ship_spend) /
                                            100)
                                        )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Phí giao hàng</span>
                                        <span>{formatCurrency(state.constShip)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 mb-2 w-full">
                                        <div className="flex flex-col gap-1 mb-2 w-full">
                                            <span>Vận chuyển: </span>
                                            <select
                                                className="px-4 py-2  border-slate-200 outline-none border  rounded-md text-slate-600"
                                                name="ship_spend"
                                                required
                                                id=""
                                                value={state.ship_spend}
                                                onChange={inputHandle}
                                            >
                                                <option value={30}>Hoả tốc</option>
                                                <option value={20}>Nhanh</option>
                                                <option value={10}>Chậm</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Tổng thanh toán</span>
                                        <span>{formatCurrency(price + state.constShip + Math.floor(
                                            (state.constShip *
                                                state.ship_spend) /
                                            100))}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Tổng cộng</span>
                                        <span>{formatCurrency(price + state.constShip + Math.floor(
                                            (state.constShip *
                                                state.ship_spend) /
                                            100))}</span>
                                    </div>


                                    <button
                                        onClick={placeOrder}
                                        disabled={res ? false : true}
                                        className={`px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg ${
                                            res ? "bg-orange-500" : "bg-orange-300"
                                        } text-sm text-white uppercase`}
                                    >
                                        Đặt hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default Shipping;
