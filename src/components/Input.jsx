const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    name={name}
    type={type}
    value={value}
    onChange={e => handleChange(e, name)}
    className={
      "my-2 w-full rounded-lg p-2 outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 border-none text-sm shadow-inner shadow-lg"
    }
  />
);

export default Input;
