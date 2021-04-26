import React from "react";

interface InputGroupProps {
  type: string;
  placeholder: string;
  value: string;
  setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  type,
  placeholder,
  value,
  setValue,
}) => {
  return (
    <div className="mb-2">
      <input
        type={type}
        className="w-full p-3 transition duration-200 border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default InputGroup;
