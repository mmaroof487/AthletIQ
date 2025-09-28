import { forwardRef } from "react";

const Select = forwardRef(({ label, error, icon, className = "", options = [], ...props }, ref) => {
	return (
		<div className="mb-4">
			{label && <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>}

			<div className="relative">
				{icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>}

				<select
					ref={ref}
					className={`
            w-full px-4 py-3 bg-dark-800 border rounded-lg focus:outline-none focus:ring-2
            ${error ? "border-error-500 focus:ring-error-300" : "border-dark-600 focus:ring-primary-300"}
            ${icon ? "pl-10" : ""}
            ${className}
          `}
					{...props}>
					<option value="" disabled>
						Select {label}
					</option>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{error && <p className="mt-1 text-sm text-error-500">{error}</p>}
		</div>
	);
});

Select.displayName = "Select";

export default Select;
