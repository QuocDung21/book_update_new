import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  get_customers,
  messageClear,
  set_status,
} from "../../store/Reducers/customerReducer";
import {
  check_comment,
  get_auth,
  get_comments,
} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";
import Search from "../components/Search";

const Comment = () => {
  const dispatch = useDispatch();
  const { reviews, successMessage, errorMessage, totalCustomers } = useSelector(
    (state) => state.auth
  );

  console.log(successMessage);
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
    dispatch(get_comments());
  }, [
    searchValue,
    currentPage,
    parPage,
    successMessage,
    errorMessage,
    totalCustomers,
  ]);

  const setStatus = async (e) => {
    dispatch(get_comments());
    dispatch(check_comment(e));
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
            {/*<select*/}
            {/*    onChange={(e) => setParPage(parseInt(e.target.value))}*/}
            {/*    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"*/}
            {/*  >*/}
            {/*    <option value="5">5</option>*/}
            {/*    <option value="5">15</option>*/}
            {/*    <option value="5">25</option>*/}
            {/*  </select>*/}
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
                  Tên người dùng
                </th>
                <th scope="col" className="py-3 px-4">
                  Bình luận
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
              {reviews.map((d, i) => (
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
                    <span>{d.review}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{d.status === true ? "Đã duyệt" : "Chưa duyệt"}</span>
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
                            onChange={(e) => {
                              setStatus({
                                status: e.target.value,
                                _id: d._id,
                              });
                            }}
                            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                            name=""
                            required
                            id=""
                          >
                            <option value="">--Cập nhật trạng thái--</option>
                            <option value={true}>Duyệt</option>
                            <option value={false}>Không duyệt</option>
                          </select>
                        </div>
                      </form>
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

export default Comment;
