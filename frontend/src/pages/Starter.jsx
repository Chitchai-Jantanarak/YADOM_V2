import { Link } from "react-router-dom";

import GradientBG from "../components/layout/GradientBG";
import Logo from "../components/ui/Logo";

export default function Starter() {
    return (
      <>
        <GradientBG />
        {/* Centered text */}
        <div className="absolute top-1/2 left-1/2 md:w-[500px] -translate-x-1/2 -translate-y-1/2 z-10 text-white flex flex-col items-center text-center text-2xl">
        <Logo width='200' height='120' color='white' />
          <div className="flex w-full">
            <Link to="/login" className="card bg-blue-400 grid h-20 flex-grow place-items-center">
            <button className="tracking-widest transition-all duration-300 util-textshadow-black hover:border-black">
              LOGIN
            </button>
            </Link>
            <div className="relative divider top-4 mx-5">OR</div>
            <Link to="/register" className="card border-2 bg-base-content flex-grow place-items-center grid h-20">
              <button className="text-white tracking-widest transition-all duration-300 util-textshadow-default">
                SIGN UP
              </button>
            </Link>
          </div>
          <br />
          <a href='/' className='text-white tracking-widest underline util-textshadow-default'> CONTINUE WITHOUT ACCOUNT </a>
        </div>
    </>
  );
}