import React from 'react';
import styled from 'styled-components';

const ViewButton = ({ onClick, size = "medium", text }) => {
    return (
        <StyledWrapper size={size}>
            <button className="animated-button" onClick={onClick}>
                <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
                <span className="text">{text}</span>
                <span className="circle" />
                <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
            </button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .animated-button {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0px;

    padding: ${({ size }) =>
        size === "small" ? "7px 18px" :
            size === "large" ? "20px 44px" :
                "16px 36px"};

    font-size: ${({ size }) =>
        size === "small" ? "12px" :
            size === "large" ? "18px" :
                "16px"};

    border: 3px solid;
    border-color: black;
    background-color: inherit;
    border-radius: 8px;
    font-weight: 600;
    color: black;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button svg {
  padding-left: 2px;
    position: absolute;
    width: 24px;
    fill: rgb(34, 197, 94);
    z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    color: green;
  }

  .animated-button .arr-1 {
    right: 16px;
  }

  .animated-button .arr-2 {
    left: -25%;
  }

  .animated-button .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: greenyellow;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .text {
  position: relative;
  z-index: 1;
  padding-right: 28px; /* space before right arrow */
  padding-left: 8px;   /* space from left side */
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}


  .animated-button:hover {
    box-shadow: 0 0 0 12px transparent;
    color: #212121;
    border-radius: 12px;
  }

  .animated-button:hover .arr-1 {
    right: -25%;
  }

  .animated-button:hover .arr-2 {
    left: 16px;
  }

  .animated-button:hover .text {
  transform: translateX(20px);
}


  .animated-button:hover svg {
    fill: #212121;
  }

  .animated-button:active {
    scale: 0.95;
    box-shadow: 0 0 0 4px greenyellow;
  }

  .animated-button:hover .circle {
    width: 220px;
    height: 220px;
    opacity: 1;
  }`;

export default ViewButton;
