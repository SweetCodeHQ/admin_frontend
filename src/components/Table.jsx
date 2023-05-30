import { useState } from "react";
import { PaginationNav, Input, TableAddItemForm } from "../components";

const TableRow = ({ item, headers, form, handleEdit }) => {
  const [clickedEdit, setClickedEdit] = useState(false);

  const [editFormData, setEditFormData] = useState({ ...form, id: item.id });

  const handleChange = (e, name) => {
    setEditFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = () => {
    handleEdit(editFormData);
    setClickedEdit(false);
  };

  const editingField = header => {
    return (
      clickedEdit &&
      (headers.indexOf(header) === 0 || headers.indexOf(header) === 1)
    );
  };

  return (
    <tr
      key={`${item[headers[0]]}`}
      className="even:bg-[#4E376A] bg-[#3A1F5C]/95 text-white"
    >
      {headers.map((header, i) =>
        editingField(header) ? (
          <td
            key={`td ${header} ${i}`}
            className="whitespace-nowrap pl-4 pr-3 text-sm font-medium sm:pl-3"
          >
            <Input
              key={header}
              name={header}
              handleChange={handleChange}
              defaultValue={item[header]}
            />
          </td>
        ) : (
          <td
            key={`td ${header} ${i}`}
            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3"
          >
            {item[header].toString()}
          </td>
        )
      )}
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
        {clickedEdit ? (
          <button
            onClick={handleSubmit}
            className="text-sm font-bold text-indigo-500 hover:text-indigo-300"
          >
            Save
            <span className="sr-only">, Item Name</span>
          </button>
        ) : (
          handleEdit && (
            <button
              onClick={() => setClickedEdit(true)}
              className="text-sm font-bold text-indigo-500 hover:text-indigo-300"
            >
              Edit
              <span className="sr-only">, Item Name</span>
            </button>
          )
        )}
      </td>
    </tr>
  );
};

const Table = ({
  tableName,
  tableDescription,
  headers,
  connection,
  flipPage,
  handleCreate,
  handleEdit,
  form
}) => {
  const [clickedCreate, setClickedCreate] = useState(false);

  const tableItems = connection?.edges.map(edge => edge.node);
  const totalItemCount = connection?.totalCount;
  const pageInfo = connection?.pageInfo;

  const generateEmptyRow = step => {
    return (
      <tr key={step} className="bg-[#3A1F5C] text-white">
        {headers.map((header, i) => (
          <td
            key={`${i}${header}`}
            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3"
          >
            {null}
          </td>
        ))}
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
          <a
            href="#"
            className="text-sm font-bold text-indigo-500 hover:text-indigo-300 invisible"
          >
            Edit<span className="sr-only">, Item Name</span>
          </a>
        </td>
      </tr>
    );
  };

  const generateEmptyRows = () => {
    let rows = [];
    const numOfEmptyRows = 10 - tableItems?.length;

    for (let step = 0; step < numOfEmptyRows; step++) {
      const newRow = generateEmptyRow(step);
      rows.push(newRow);
    }
    return rows;
  };

  return (
    <div className="pt-5 pb-5 px-4 sm:px-6 lg:px-8 bg-[#3A1F5C] rounded-xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold leading-6 text-white">
            {tableName}
          </h1>
          <p className="mt-2 text-sm text-gray-200">{tableDescription}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {clickedCreate ? (
            <TableAddItemForm
              form={form}
              tableName={tableName}
              setClickedCreate={setClickedCreate}
              handleCreate={handleCreate}
            />
          ) : null}
          {!clickedCreate
            ? handleCreate && (
                <button
                  onClick={() => setClickedCreate(true)}
                  type="button"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add Entity
                </button>
              )
            : null}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 md:min-h-[650px] md:min-w-[750px]">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {headers.map((header, i) => {
                    return (
                      <th
                        key={header}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-3"
                      >
                        {header.toUpperCase()}
                      </th>
                    );
                  })}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white rounded-bl-full">
                {tableItems?.map((item, i) => (
                  <TableRow
                    key={`tr ${i}`}
                    item={item}
                    headers={headers}
                    form={form}
                    handleEdit={handleEdit}
                  />
                ))}
                {generateEmptyRows()}
              </tbody>
            </table>
            <PaginationNav
              totalItemCount={totalItemCount}
              itemType={tableName}
              pageInfo={pageInfo}
              flipPage={flipPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
