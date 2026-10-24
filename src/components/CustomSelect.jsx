import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function CustomSelect({ options, value, onChange, placeholder, Icon }){
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return(
        <div className="relative" ref={ref}>
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 block pl-10 p-2.5 outline-none transition-all text-left flex items-center justify-between"
        >
            <div className="flex items-center truncate">
            {Icon && <Icon className="w-4 h-4 text-slate-400 absolute left-3" />}
            <span className={!selectedOption ? 'text-slate-400' : ''}>
                {selectedOption ? selectedOption.label : placeholder}
            </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
            <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto py-1">
            {options.map((opt) => (
                <li
                key={opt.value}
                onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === opt.value
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                >
                {opt.label}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}