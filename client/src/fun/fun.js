import axios from "axios";

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

export const country = async () => {
    try {
        const response = await axios.get("https://provinces.open-api.vn/api/");
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error; // Rethrow the error so that it can be caught in the calling function
    }
};