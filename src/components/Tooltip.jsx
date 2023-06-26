const Tooltip = ({ text, children }) => {
  return (
    <div className="group relative flex">
      {children}
      <span className="absolute bottom-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 w-[100px] text-center">
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
