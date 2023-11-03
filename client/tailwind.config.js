/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        bg_df_: "#1da1f2", // Đây là mã màu bạn muốn thêm
      },
      textColor: {
        t_df_: "#1da1f2",
      },
    },
    screens: {
      xl: { max: "1200px" },
      lg: { max: "1080px" },
      "md-lg": { max: "991px" },
      md: { max: "768px" },
      sm: { max: "576px" },
      xs: { max: "480px" },
      "2xs": { max: "340px" },
    },
  },
  plugins: [require("daisyui")],
};
