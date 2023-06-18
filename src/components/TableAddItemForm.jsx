import { useState } from "react";
import { Input, Button } from "../components";

const TableAddItemForm = ({
  form,
  tableName,
  setClickedCreate,
  handleCreate
}) => {
  const [formData, setFormData] = useState(form);
  const keys = Object.keys(form);

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = () => {
    const values = Object.values(formData);

    const formIsFilled = values.every(currentValue => currentValue);
    if (formIsFilled) {
      setClickedCreate(false);
      handleCreate(formData);
    } else {
      return;
    }
  };

  return (
    <div className="w-full flex justify-end transition">
      <div className="p-2 border border-2 rounded-lg w-3/5">
        <h1 className="text-white">Add New {tableName}</h1>
        {keys.map(key => {
          return (
            <Input
              key={`create ${tableName} ${key}`}
              placeholder={key.toUpperCase()}
              name={key}
              handleChange={handleChange}
              value={formData[name]}
            />
          );
        })}
        <button
          onClick={handleSubmit}
          className="relative inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#3A1F5C] ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 transition delay-50 ease-in-out hover:scale-105"
        >
          Submit
        </button>
        <button
          onClick={() => setClickedCreate(false)}
          className="relative inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#3A1F5C] ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-0 transition delay-50 ease-in-out hover:scale-105 ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TableAddItemForm;
