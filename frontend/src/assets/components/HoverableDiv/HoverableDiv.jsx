import React, { useState } from "react";
import { useLanguage } from "../../locale/LanguageContext";

export default function HoverableDiv({
  count,
  label,
  initialColor,
  hoverColor,
  onChange,
  labelFontSize,
  percent,
}) {
  const { translate } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Format count to have only one number after the decimal if it's a number or contains a percentage
  let displayPercent = percent;
  if (typeof percent === "string" && percent.includes("%")) {
    // Extract the number before % and format it
    displayPercent = percent.replace(
      /(\d+\.?\d*)%?/,
      (match, num) => `${parseFloat(num).toFixed(1)}%`
    );
  } else if (!isNaN(percent)) {
    displayPercent = parseFloat(percent).toFixed(1);
  }

  return (
    <div
      style={{
        backgroundColor: isHovered ? hoverColor : initialColor,
        color: "white",
        width: 140,
        textAlign: "center",
        height: 40,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 2,
        fontWeight: "bold",
        cursor: "pointer",
        padding: "25px 0",
        transition: "background-color 0.3s ease",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onChange}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onChange()}
    >
      <div
        style={{
          padding: "10px 0",
          fontSize: labelFontSize || "inherit",
          // position: "absolute",
          // right: "5px",
          width: "90px",
          textAlign: "center",
        }}
      >
        {translate(label)}
      </div>
      <div
        style={{
          fontSize: 10,
          backgroundColor: hoverColor,
          borderRadius: 50,
          padding: 9,
          // position: "absolute",
          // left: "4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "50px",
          textAlign: "center",
        }}
      >
        <span>{count}</span>
        <span>{displayPercent}</span>
      </div>
    </div>
  );
}
