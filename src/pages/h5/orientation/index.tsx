import { useEffect, useState } from "react";

const Orientation = () => {
  const [device, setDevice] = useState("Android");
  const [angle, setAngle] = useState({});

  const onDeviceOrientationChange = (evt: any) => {
    setAngle({
      alpha: evt.alpha,
      beta: evt.beta,
      gamma: evt.gamma,
    });
  };

  useEffect(() => {
    if (window) {
      console.log(navigator.userAgent);
      setDevice(navigator.userAgent);
      window.addEventListener("deviceorientation", onDeviceOrientationChange, {
        passive: false,
      });
    }
    return () => {
      window.removeEventListener(
        "deviceorientation",
        onDeviceOrientationChange,
      );
    };
  }, []);
  return (
    <div>
      Orientation
      <div>{device}</div>
      <div>{JSON.stringify(angle)}</div>
    </div>
  );
};

export default Orientation;
