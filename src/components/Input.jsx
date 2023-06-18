const Input = ({
  placeholder,
  name,
  type,
  value,
  defaultValue,
  step,
  handleChange,
  customStyles
}) => {
  const defaultStyles =
    "my-2 w-full rounded-lg p-2 text-white bg-[#4E376A]/75 placeholder-gray-400 text-sm shadow-inner shadow-lg hover:border-violet-500";

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
      step="1"
    />
  );
};

export default Input;
