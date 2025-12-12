
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

/**
 * NODE COMPONENTS LIBRARY
 * -----------------------
 * A set of styled UI components specifically designed for React Flow custom nodes.
 * Features:
 * - Built-in Handle support via NodeField
 * - Cyberpunk/Dark mode styling defaults (text-[10px], neon borders)
 * - Compact form controls (Inputs, Selects, Radio Groups)
 */

// --- Types ---

export interface TokenData {
    id: string;
    symbol: string;
    name: string;
    icon: string;
}

export interface NodeRadioOption {
  value: string;
  label: string;
}

// --- Components ---

interface NodeFieldProps {
  label?: string;
  required?: boolean;
  handleId?: string;
  handleType?: 'source' | 'target';
  handlePosition?: Position;
  isConnectable?: boolean;
  handleColor?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * NodeField: Wraps a form element with a Label and an optional React Flow Handle.
 * Use this to make any parameter "connectable" in the graph.
 */
export const NodeField: React.FC<NodeFieldProps> = ({
  label,
  required,
  handleId,
  handleType = 'target',
  handlePosition = Position.Left,
  isConnectable,
  handleColor = '#00f3ff',
  className = "",
  children
}) => {
  
  // Determine absolute positioning class based on Handle Position
  const getHandlePositionClass = () => {
    switch(handlePosition) {
      case Position.Left: return '-left-4 top-1/2 -translate-y-1/2';
      case Position.Right: return '-right-4 top-1/2 -translate-y-1/2';
      case Position.Top: return '-top-3 left-1/2 -translate-x-1/2';
      case Position.Bottom: return '-bottom-3 left-1/2 -translate-x-1/2';
      default: return '-left-4 top-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className={`space-y-1 relative group/field ${className}`}>
      {handleId && (
        <div className={`absolute ${getHandlePositionClass()} z-10`}>
          <Handle
            type={handleType}
            position={handlePosition}
            id={handleId}
            style={{ 
                width: '8px', 
                height: '8px', 
                background: handleColor, 
                border: '1px solid #121218',
                boxShadow: `0 0 5px ${handleColor}80`
            }}
            isConnectable={isConnectable}
          />
        </div>
      )}
      {label && (
        <div className="flex items-center justify-between pointer-events-none">
          <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase pointer-events-auto">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
        </div>
      )}
      {children}
    </div>
  );
};

interface NodeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rightElement?: React.ReactNode;
}

export const NodeInput: React.FC<NodeInputProps> = ({ className = "", rightElement, ...props }) => (
  <div className="relative group">
    <input
      {...props}
      className={`w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded px-2 py-1.5 text-[10px] font-mono text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-cyber-neon outline-none transition-colors ${className}`}
    />
    {rightElement && (
      <div className="absolute right-1 top-0 h-full flex flex-col justify-center gap-0.5">
        {rightElement}
      </div>
    )}
  </div>
);

interface NodeNumberInputProps extends NodeInputProps {}

export const NodeNumberInput: React.FC<NodeNumberInputProps> = (props) => {
    return (
        <NodeInput 
            {...props} 
            type="number" 
            className={`pr-5 ${props.className || ''}`}
            rightElement={
                <>
                    <ChevronUp size={8} className="text-gray-400 cursor-pointer hover:text-black dark:hover:text-white" />
                    <ChevronDown size={8} className="text-gray-400 cursor-pointer hover:text-black dark:hover:text-white" />
                </>
            }
        />
    )
}

export const NodeTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={`w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded px-2 py-2 text-[10px] font-mono text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-cyber-neon outline-none resize-y placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors ${className}`}
  />
);

interface NodeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const NodeSelect: React.FC<NodeSelectProps> = ({ options, className = "", ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded px-2 py-2 text-[10px] font-mono text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-cyber-neon outline-none appearance-none hover:border-purple-400 transition-colors cursor-pointer ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

interface NodeRadioGroupProps {
  name: string;
  options: NodeRadioOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'danger' | 'primary';
}

export const NodeRadioGroup: React.FC<NodeRadioGroupProps> = ({ name, options, value, onChange, variant = 'primary' }) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((opt) => {
      const isSelected = value === opt.value;
      
      const colors = variant === 'danger' 
        ? {
            wrapper: isSelected ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5',
            activeText: 'text-red-500 dark:text-red-400',
            activeBorder: 'border-red-500 dark:border-red-400',
            activeBg: 'bg-red-500 dark:bg-red-400', // Dot center
            ringColor: 'border-red-400 dark:border-red-400', // Ring
          }
        : {
            wrapper: isSelected ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5',
            activeText: 'text-purple-600 dark:text-cyber-neon',
            activeBorder: 'border-purple-600 dark:border-cyber-neon',
            activeBg: 'bg-purple-600 dark:bg-cyber-neon',
            ringColor: 'border-purple-600 dark:border-cyber-neon',
          };

      return (
        <label 
            key={opt.value} 
            className={`flex items-center gap-2 cursor-pointer group select-none p-1.5 rounded-md border transition-all ${colors.wrapper}`}
        >
          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all shrink-0 ${isSelected ? colors.ringColor : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
            {isSelected && <div className={`w-2 h-2 rounded-full ${colors.activeBg}`}></div>}
          </div>
          <span className={`text-[10px] transition-colors leading-none ${isSelected ? `${colors.activeText} font-bold` : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
            {opt.label}
          </span>
          <input
            type="radio"
            className="hidden"
            name={name}
            checked={isSelected}
            onChange={() => onChange(opt.value)}
          />
        </label>
      );
    })}
  </div>
);

interface NodeSliderProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (val: number) => void;
    className?: string;
    disabled?: boolean;
}

export const NodeSlider: React.FC<NodeSliderProps> = ({ value, min = 0, max = 100, step = 1, onChange, className = "", disabled }) => {
    return (
        <div className={`flex items-center w-full ${className}`}>
             <input 
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={disabled}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-400 focus:outline-none focus:ring-0"
             />
        </div>
    )
}

interface NodeTokenSelectProps {
    tokens: TokenData[];
    value: string;
    onChange: (symbol: string) => void;
    placeholder?: string;
}

export const NodeTokenSelect: React.FC<NodeTokenSelectProps> = ({ tokens, value, onChange, placeholder = "Select token..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    
    const filtered = tokens.filter(t => 
        t.symbol.toLowerCase().includes(search.toLowerCase()) || 
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedToken = tokens.find(t => t.symbol === value);

    return (
        <div className="relative">
            <button
                onClick={() => { setIsOpen(!isOpen); setSearch(""); }}
                className={`w-full bg-white dark:bg-[#050505] border rounded px-2 py-1.5 flex items-center justify-between transition-colors ${isOpen ? 'border-purple-500 dark:border-cyber-neon' : 'border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-cyber-neon/50'}`}
            >
                <span className={`text-[10px] font-mono flex items-center gap-2 ${value ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-400'}`}>
                    {value && <div className={`w-2 h-2 rounded-full ${selectedToken?.icon || 'bg-gray-400'}`}></div>}
                    {value || placeholder}
                </span>
                <Search size={10} className="text-gray-400" />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 w-full z-20 mt-1 bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/10 rounded shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full p-2 text-[9px] bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5 outline-none text-gray-900 dark:text-white font-mono placeholder:text-gray-400"
                        />
                        <div className="max-h-32 overflow-y-auto scrollbar-hide">
                            {filtered.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => { onChange(t.symbol); setIsOpen(false); }}
                                    className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${t.icon}`}></div>
                                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-cyber-neon">{t.symbol}</span>
                                    </div>
                                    {value === t.symbol && <div className="w-1 h-1 bg-purple-600 dark:bg-cyber-neon rounded-full"></div>}
                                </div>
                            ))}
                            {filtered.length === 0 && <div className="p-2 text-[9px] text-gray-500 text-center italic">No results found</div>}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
