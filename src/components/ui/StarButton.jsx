import React from "react";
import styled from "styled-components";

const StarButton = ({
  onClick,
  label = "Post Problem",
  variant = "primary",
  size = "medium",
}) => {
  return (
    <StyledWrapper variant={variant} size={size}>
      <button onClick={onClick}>
        <span className="icon">
          +
        </span>

        {/* Hide text on small screens */}
        <span className="label hidden sm:inline">
          {label}
        </span>

        <span className="shine" />
      </button>
    </StyledWrapper>
  );
};
 

const StyledWrapper = styled.div`
  button {
    position: relative;
    overflow: hidden;

    display: inline-flex;
    align-items: center;
    gap: 10px;

    padding: ${({ size }) =>
    size === "small"
      ? "8px 18px"
      : size === "large"
        ? "14px 32px"
        : "11px 26px"};

    font-size: ${({ size }) =>
    size === "small"
      ? "13px"
      : size === "large"
        ? "17px"
        : "15px"};

    font-weight: 600;
    letter-spacing: 0.3px;

    border-radius: 14px;
    border: none;

    background: linear-gradient(135deg, #16a34a, #22c55e);
    color: white;

    box-shadow: 0 6px 18px rgba(34, 197, 94, 0.25);

    transition: all 0.25s ease;
    cursor: pointer;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(34, 197, 94, 0.35);
  }

  button:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 22px;
    height: 22px;

    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    font-size: 16px;
    font-weight: 700;

    transition: transform 0.3s ease;
  }

  button:hover .icon {
    transform: rotate(90deg);
  }

  /* Shine sweep animation */
  .shine {
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.2)
    );
    transform: skewX(-20deg);
  }

  button:hover .shine {
    animation: shine 0.8s ease forwards;
  }

  @keyframes shine {
    0% {
      left: -75%;
    }
    100% {
      left: 125%;
    }
  }
`;

export default StarButton;
