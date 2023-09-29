import { useState, useContext } from "react";
import { PaginationNav, Input, TableAddItemForm } from "../components";
import { EntityContext } from "../context/EntityContext";

const HEADERS = ["name", "url", "users", "topics", "units"];

const TableRow = ({ entity, editEntity, i }) => {
  const [clickedEdit, setClickedEdit] = useState(false);

  const resetForm = () => {
    return {
      id: entity.node.id,
      name: entity.node.name,
      url: entity.node.url,
      credits: entity.node.credits
    };
  };

  const handleClick = () => {
    const resetData = resetForm();
    setEditEntityForm(resetData);
    setClickedEdit(prev => !prev);
  };

  const handleSubmit = async () => {
    let submissionData = { id: entity.node.id };

    Object.keys(editEntityForm).forEach(formItem => {
      editEntityForm[formItem] !== entity.node[formItem]
        ? (submissionData = {
            ...submissionData,
            [formItem]: editEntityForm[formItem]
          })
        : null;
    });

    await editEntity(submissionData);
    resetForm();
    setClickedEdit(false);
  };

  const [editEntityForm, setEditEntityForm] = useState(() => resetForm());

  const handleChange = (e, name) => {
    name === "credits"
      ? setEditEntityForm(prevState => ({
          ...prevState,
          [name]: +e.target.value
        }))
      : setEditEntityForm(prevState => ({
          ...prevState,
          [name]: e.target.value
        }));
  };

  return (
    <tr
      key={`${entity.node.name}`}
      className="even:bg-[#4E376A] bg-[#3A1F5C]/95 text-white"
    >
      <td
        key={`td ${entity.node.name} name`}
        className="whitespace-nowrap pl-4 pr-3 mr-2 text-sm font-medium sm:pl-3 max-w-[150px] truncate"
      >
        {clickedEdit ? (
          <Input
            key={"name input"}
            name={"name"}
            handleChange={handleChange}
            defaultValue={entity.node.name}
            customStyles={`w-full rounded-lg p-2 text-white bg-[#4E376A]/75 border-gray-500 border placeholder-gray-400 text-sm shadow-inner shadow-lg hover:border-violet-500`}
          />
        ) : (
          entity.node.name
        )}
      </td>
      <td
        key={`td ${entity.node.name} url`}
        className="whitespace-nowrap pl-4 pr-3 mr-2 text-sm font-medium sm:pl-3 max-w-[150px] truncate"
      >
        {clickedEdit ? (
          <Input
            key={"url input"}
            name={"url"}
            handleChange={handleChange}
            defaultValue={entity.node.url}
            customStyles={`w-full rounded-lg p-2 text-white bg-[#4E376A]/75 border-gray-500 border placeholder-gray-400 text-sm shadow-inner shadow-lg hover:border-violet-500`}
          />
        ) : (
          entity.node.url
        )}
      </td>
      <td
        key={`td ${entity.node.name} users`}
        className="whitespace-nowrap py-4 pl-4 pr-3 mr-2 text-sm font-medium sm:pl-3 max-w-[150px] text-center"
      >
        {entity.node.userCount}
      </td>
      <td
        key={`td ${entity.node.name} topics`}
        className="whitespace-nowrap py-4 pl-4 pr-3 mr-2 text-sm font-medium sm:pl-3 max-w-[150px] text-center"
      >
        {entity.node.topicCount}
      </td>
      <td
        key={`td ${entity.node.name} credits`}
        className="whitespace-nowrap text-sm font-medium sm:pl-3 max-w-[75px] text-center"
      >
        {clickedEdit ? (
          <Input
            key={"credits input"}
            name={"credits"}
            handleChange={handleChange}
            defaultValue={entity.node.credits}
            type={"number"}
            customStyles={`w-3/4 rounded-lg text-white bg-[#4E376A]/75 border-gray-500 border placeholder-gray-400 text-sm shadow-inner shadow-lg hover:border-violet-500`}
          />
        ) : entity.node.credits ? (
          entity.node.credits
        ) : (
          "NEW"
        )}
      </td>
      <td className="relative whitespace-nowrap py-4 pr-4 text-right text-sm font-medium sm:pr-3">
        <button
          onClick={clickedEdit ? handleSubmit : handleClick}
          className="text-sm font-bold text-indigo-500 hover:text-indigo-300"
        >
          {clickedEdit ? "Save" : "Edit"}
          <span className="sr-only">, Item Name</span>
        </button>
      </td>
    </tr>
  );
};

const EntitiesTable = ({ entities, fetchMore, refetch, flipEntityPage }) => {
  const { sendEntity, editEntity } = useContext(EntityContext);

  const [clickedCreate, setClickedCreate] = useState(false);

  const handleCreateEntity = async data => {
    await sendEntity(data);
    refetch();
  };

  const generateEmptyRow = step => {
    return (
      <tr key={`empty row ${step}`} className="bg-[#3A1F5C]">
        {HEADERS.map((header, i) => (
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
    const numOfEmptyRows = 10 - entities?.edges?.length;

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
          <h1 className="text-3xl font-bold leading-6 text-white">Entities</h1>
          <p className="mt-2 text-sm text-gray-200">
            A list of all companies in our database.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {clickedCreate ? (
            <TableAddItemForm
              form={{ name: "", url: "" }}
              tableName="Entities"
              setClickedCreate={setClickedCreate}
              handleCreate={handleCreateEntity}
            />
          ) : (
            <button
              onClick={() => setClickedCreate(true)}
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Entity
            </button>
          )}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 md:min-h-[650px] md:min-w-[750px]">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {HEADERS.map((header, i) => {
                    return (
                      <th
                        key={header}
                        scope="col"
                        className={`py-3.5 pl-4 pr-3 text-sm font-semibold text-white ${
                          i == 0 || i == 1 ? "text-left" : "text-center"
                        } sm:pl-3`}
                      >
                        {header.toUpperCase()}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white rounded-bl-full">
                {entities?.edges?.map((entity, i) => (
                  <TableRow
                    key={`tr ${i}`}
                    entity={entity}
                    editEntity={editEntity}
                    i={i}
                  />
                ))}
                {generateEmptyRows()}
              </tbody>
            </table>
            <PaginationNav
              totalItemCount={entities?.totalCount}
              itemType="Entities"
              pageInfo={entities?.pageInfo}
              flipPage={flipEntityPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EntitiesTable;
