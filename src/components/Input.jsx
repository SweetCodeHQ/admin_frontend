const Input = ({
  placeholder,
  name,
  type,
  value,
  defaultValue,
  handleChange,
  customStyles
}) => {
  const defaultStyles =
    "my-2 w-full rounded-lg p-2 outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 border-none text-sm shadow-inner shadow-lg";

  const styles = customStyles || defaultStyles;

  return (
    <input
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={e => handleChange(e, name)}
      className={styles}
    />
  );
};

export default Input;
