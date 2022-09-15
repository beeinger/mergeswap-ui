import { useEffect, useRef, useState } from "react";

import { AiFillInfoCircle } from "react-icons/ai";
import { StyledTooltip } from "./styles";

const Tooltip = ({
  tooltip,
  children,
  active = true,
  left = false,
}: {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  left?: boolean;
}) => {
  const [isToggled, setIsToggled] = useState(false);
  const toggle = (e) => {
    e.stopPropagation();
    setIsToggled(!isToggled);
  };
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) =>
      tooltipRef.current &&
      !tooltipRef.current.contains(e.target) &&
      setIsToggled(false);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!active) setIsToggled(false);
  }, [active, isToggled]);

  return (
    <StyledTooltip
      ref={tooltipRef}
      onClick={toggle}
      isToggled={isToggled}
      left={left}
    >
      <div>
        <AiFillInfoCircle />
        {tooltip}
      </div>
      {children}
      <AiFillInfoCircle />
    </StyledTooltip>
  );
};

export default Tooltip;
