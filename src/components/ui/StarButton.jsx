import React from 'react';
import styled from 'styled-components';

const StarButton = ({ onClick, starcolor = "red", size="small" }) => {
    return (
        <StyledWrapper starcolor={starcolor} size={size}>
            <button onClick={onClick}>
                Post Problem

                <div className="star-1">{starSVG}</div>
                <div className="star-2">{starSVG}</div>
                <div className="star-3">{starSVG}</div>
                <div className="star-4">{starSVG}</div>
                <div className="star-5">{starSVG}</div>
                <div className="star-6">{starSVG}</div>
            </button>
        </StyledWrapper>
    );
};

const starSVG = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        viewBox="0 0 784.11 815.53"
    >
        <path
            className="fil0"
            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 
               207.96,29.37 371.12,197.68 392.05,407.74 
               20.93,-210.06 184.09,-378.37 392.05,-407.74 
               -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
        />
    </svg>
);

const StyledWrapper = styled.div`
    button {
    position: relative;

    padding: ${({ size }) =>
        size === "small" ? "8px 20px" :
            size === "large" ? "16px 45px" :
                "12px 35px"};

    font-size: ${({ size }) =>
        size === "small" ? "13px" :
            size === "large" ? "19px" :
                "17px"};

    background: rgb(72, 204, 48);
    font-weight: 500;
    color: #fff;
    font-weight: 700;
    border: 1px solid black;
    border-radius: 8px;
    box-shadow: 0 0 0 #fec1958c;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .star-1 {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 25px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
  }

  .star-2 {
    position: absolute;
    top: 45%;
    left: 45%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-3 {
    position: absolute;
    top: 40%;
    left: 40%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-4 {
    position: absolute;
    top: 20%;
    left: 40%;
    width: 8px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-5 {
    position: absolute;
    top: 25%;
    left: 45%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-6 {
    position: absolute;
    top: 5%;
    left: 50%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.8s ease;
  }

  button:hover {
    background: transparent;
    color: black;
    box-shadow: 0 0 25px rgb(75, 251, 43);
  }

  button:hover .star-1 {
    position: absolute;
    top: -80%;
    left: -30%;
    width: 25px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-2 {
    position: absolute;
    top: -25%;
    left: 10%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-3 {
    position: absolute;
    top: 55%;
    left: 25%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-4 {
    position: absolute;
    top: 30%;
    left: 80%;
    width: 8px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-5 {
    position: absolute;
    top: 25%;
    left: 115%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-6 {
    position: absolute;
    top: 5%;
    left: 60%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  .fil0 {
    fill: ${({ starcolor }) => starcolor};
  }`;

export default StarButton;
