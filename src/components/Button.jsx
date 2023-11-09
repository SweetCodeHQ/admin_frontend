const Button = ({ handleClick, text, customStyles }) => {
  const defaultStyles =
    'bg-white py-2 px-7 mx-4 rounded-full cursor-pointer font-bold text-[#2D104F] transition delay-50 ease-in-out hover:scale-105';

  const styles = customStyles || defaultStyles;

  return (
    <button className={styles} type="button" onClick={() => handleClick()}>
      {text}
    </button>
  );
};

export default Button;
