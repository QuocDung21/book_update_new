import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Countdown = () => {
  const [days, setDays] = useState(15);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(24);
  const [seconds, setSeconds] = useState(54);

  useEffect(() => {
    const interval = setInterval(() => {
      // Giảm giá trị của seconds xuống 1 mỗi giây
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          // Khi seconds đạt 0, giảm giá trị của minutes và reset seconds
          setMinutes((prevMinutes) => {
            if (prevMinutes === 0) {
              // Khi minutes đạt 0, giảm giá trị của hours và reset minutes
              setHours((prevHours) => {
                if (prevHours === 0) {
                  // Khi hours đạt 0, giảm giá trị của days và reset hours
                  setDays((prevDays) => {
                    if (prevDays === 0) {
                      // Khi days đạt 0, có thể thực hiện hành động nào đó ở đây
                      clearInterval(interval); // Dừng đếm ngược
                      return 0; // Đã hết thời gian
                    }
                    return prevDays - 1;
                  });
                  return 23; // Reset hours
                }
                return prevHours - 1;
              });
              return 59; // Reset minutes
            }
            return prevMinutes - 1;
          });
          return 59; // Reset seconds
        }
        return prevSeconds - 1;
      });
    }, 1000);

    // Xóa interval khi component bị unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-[80%]  lg:flex-row">
      <div className="w-full">
        <div className="text-center flex justify-center items-center flex-col text-4xl text-slate-600 font-bold relative pb-[45px]">
          <h2 className="uppercase">Khuyến mãi</h2>
          <div className="w-[100px] h-[4px] bg-bg_df_ mt-4"></div>
        </div>
      </div>
      <div className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
          <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": days }}></span>
            </span>
            days
          </div>
          <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": hours }}></span>
            </span>
            hours
          </div>
          <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": minutes }}></span>
            </span>
            min
          </div>
          <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": seconds }}></span>
            </span>
            sec
          </div>
        </div>
      </div>
      <div className="divider lg:divider-horizontal">
        Nhập mã để được giảm giá
      </div>
      <div className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">
        <h1>Giảm giá 10%</h1>
        <h2>Hãy nhập mã : Dũng đẹp trai để được giảm giá nhé</h2>
      </div>
    </div>
  );
};

export default Countdown;
