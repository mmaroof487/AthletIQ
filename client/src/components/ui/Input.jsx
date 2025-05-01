import React, { forwardRef } from "react";

const Input = forwardRef(({ label, error, icon, className = "", ...props }, ref) => {
	return (
		<div className="mb-4">
			{label && <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>}

			<div className="relative">
				{icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>}

				<input
					ref={ref}
					className={`
            w-full px-4 py-3 bg-dark-800 border rounded-lg focus:outline-none focus:ring-2
            ${error ? "border-error-500 focus:ring-error-300" : "border-dark-600 focus:ring-primary-300"}
            ${icon ? "pl-10" : ""}
            ${className}
          `}
					{...props}
				/>
			</div>

			{error && <p className="mt-1 text-sm text-error-500">{error}</p>}
		</div>
	);
});

Input.displayName = "Input";

export default Input;
