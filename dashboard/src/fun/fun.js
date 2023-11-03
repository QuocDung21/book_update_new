import api from "../api/api";
import toast from "react-hot-toast";
import axios from "axios";

export const deleteFun = async (query, id, callback) => {
    try {
        await api.delete(query + id).then((res) => {
            toast.success("Xoá thành công")
            callback()
        }).catch((err) => {
            console.error(err)
            toast.error("Xoá không thành công")
        })
    } catch (e) {

    }
}

export const getFun = async (query, id) => {
    try {
        const response = await api.get(query + id);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export  const  formatCurrency =(number) =>{
    if (isNaN(number)) {
        return "Không hợp lệ";
    }

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    });

    return formatter.format(number);
}


export const getAllFun = async (query, data) => {
    try {
        await api.get(query).then((res) => {
            return data
        }).catch((err) => {
            console.error(err)
        })
    } catch (e) {

    }
}


export const country = async () => {
    try {
        const response = await axios.get("https://provinces.open-api.vn/api/");
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error; // Rethrow the error so that it can be caught in the calling function
    }
};