import React, {useEffect} from "react";
import {AiFillHeart, AiOutlineShoppingCart} from "react-icons/ai";
import {FaEye} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import Ratings from "../Ratings";
import {
    add_to_card, messageClear, add_to_wishlist,
} from "../../store/reducers/cardReducer";
import {formatCurrency} from "../../fun/fun";

const FeatureProducts = ({products}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);
    const {successMessage, errorMessage} = useSelector((state) => state.card);

    const add_card = (id) => {
        if (userInfo) {
            dispatch(add_to_card({
                userId: userInfo.id, quantity: 1, productId: id,
            }));
        } else {
            navigate("/login");
        }
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
    }, [errorMessage, successMessage]);

    const add_wishlist = (pro) => {
        dispatch(add_to_wishlist({
            userId: userInfo.id,
            productId: pro._id,
            name: pro.name,
            price: pro.price,
            image: pro.images[0],
            discount: pro.discount,
            rating: pro.rating,
            slug: pro.slug,
        }));
    };
    return (<div className="w-[85%] flex flex-wrap mx-auto">
        <div className="w-full">
            <div
                className="text-center flex justify-center items-center flex-col text-4xl text-slate-600 font-bold relative pb-[45px]">
                <h2 className="uppercase">Sản phẩm nổi bật</h2>
                <div className="w-[100px] h-[4px] bg-bg_df_ mt-4"></div>
            </div>
        </div>
        <div className="w-full grid grid-cols-5 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-1">
            {products.map((p, i) => (<div
                key={i}
                className="border group m-2 transition-all duration-500 hover:shadow-md hover:-mt-3"
            >
                <div className=" relative overflow-hidden">
                    {p.discount ? (<div
                        className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                        {p.discount}%
                    </div>) : ("")}
                    <img
                        className="sm:w-full w-full object-cover h-[240px]"
                        src={p.images[0] ? p.images[0] : "data:image/jpeg;base64,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"}
                        alt="product image"
                    />
                    <ul className="flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3">
                        <li
                            onClick={() => add_wishlist(p)}
                            className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-bg_df_ hover:text-white hover:rotate-[720deg] transition-all"
                        >
                            <AiFillHeart/>
                        </li>
                        <Link
                            to={`/product/details/${p.slug}`}
                            className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-bg_df_ hover:text-white hover:rotate-[720deg] transition-all"
                        >
                            <FaEye/>
                        </Link>
                        <li
                            onClick={() => add_card(p._id)}
                            className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-bg_df_ hover:text-white hover:rotate-[720deg] transition-all"
                        >
                            <AiOutlineShoppingCart/>
                        </li>
                    </ul>
                </div>
                <div className="py-3 text-slate-600 px-2">
                    <h2 className="flex justify-center text-center">{p.name}</h2>
                    <div className="flex justify-center  flex-col items-center gap-3">
                        <span className="text-lg  font-bold">{formatCurrency(p.price)}</span>
                        <div className="flex">
                            <Ratings ratings={p.rating}/>
                        </div>
                    </div>
                </div>
            </div>))}
        </div>
    </div>);
};

export default FeatureProducts;
