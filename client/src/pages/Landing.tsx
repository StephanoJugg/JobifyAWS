import React from "react";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            {" "}
            job <span>tracking</span> app
          </h1>
          <p>
            I'm baby taiyaki tofu actually, venmo plaid gastropub neutra
            aesthetic next level. Gochujang iPhone meggings health goth. Freegan
            DSA etsy portland.
          </p>
          <Link to="/register" className="btn btn-hero">
            {" "}
            Login/Register
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img"></img>
      </div>
    </Wrapper>
  );
}
