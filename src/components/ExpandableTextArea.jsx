import { useRef, useEffect } from 'react';

const ExpandableTextArea = ({
  handleChange,
  placeholder,
  name,
  defaultValue,
  textBoxOpener,
  formData,
}) => {
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef && textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = `${textRef.current.scrollHeight + 2}px`;
    }
  }, [textRef, formData, textBoxOpener]);

  return (
    <textarea
      ref={textRef}
      placeholder={placeholder}
      name={name}
      type="text"
      defaultValue={defaultValue}
      onChange={(e) => handleChange(e, name)}
      className="mt-1 w-full rounded-lg outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 hover:border-violet-500 text-sm  shadow-lg resize-none max-h-[250px]"
    />
  );
};

export default ExpandableTextArea;
