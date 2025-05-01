import React from "react";

const Card = ({ children, title, className = "", hoverEffect = false, bordered = true }) => {
  return (
    <div
      className={`
        bg-dark-800 rounded-xl p-6 shadow-lg
        ${bordered ? "border border-dark-700" : ""}
        ${hoverEffect ? "transition-all hover:shadow-xl hover:border-primary-500 hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
