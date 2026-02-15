import React from "react";
import styled from "styled-components";

const Switch = ({ searchType, setSearchType }) => {
    const isUser = searchType === "user";

    return (
        <StyledWrapper>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={isUser}
                    onChange={(e) =>
                        setSearchType(e.target.checked ? "user" : "problem")
                    }
                />
                <span className="slider" />
            </label>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .switch {
    position: relative;
    display: inline-block;
    width: 90px;
    height: 26px;
  }

  .switch input {
    display: none;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #e5e7eb;
    transition: 0.3s;
    border-radius: 20px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 3px;
    top: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  input:checked + .slider {
    background-color: #16a34a;
  }

  input:checked + .slider:before {
    transform: translateX(64px);
  }

  /* Labels */
  .slider:after {
    content: "PROB";
    color: #374151;
    position: absolute;
    top: 50%;
    left: 65%;
    transform: translate(-50%, -50%);
    font-size: 9px;
    font-weight: 600;
  }

  input:checked + .slider:after {
    content: "USER";
    left: 35%;
    color: white;
  }
`;

export default Switch;
