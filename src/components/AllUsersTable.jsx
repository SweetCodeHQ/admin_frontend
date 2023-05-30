import { useState } from "react";
import { AdminSwitch, PaginationNav } from "../components";

const TableRow = ({ user }) => {
  const formatDate = isoDate => {
    const date = new Date(isoDate);
    const [day, month, year] = [
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear()
    ];
    return `${month}/${day}/${year}`;
  };

  const formatBoolean = boolean => {
    return boolean ? "Yes" : "No";
  };

  const showAdminToggle = user.email.endsWith("fixate.io");

  return (
    <tr className="even:bg-[#4E376A] bg-[#3A1F5C]/95 text-white">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3">
        {user.email}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3 text-center">
        {user.topicCount}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3 text-center">
        {user.loginCount}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3 text-center">
        {user.clickedGenerateCount}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
        <AdminSwitch
          key={user.email}
          userId={user.id}
          isOn={user.isBlocked}
          forAdmin={false}
        />
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3 text-center">
        {formatDate(user.createdAt)}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
        {showAdminToggle ? (
          <AdminSwitch
            key={`${user.email}admin`}
            userId={user.id}
            isOn={user.isAdmin}
            forAdmin={true}
          />
        ) : null}
      </td>
    </tr>
  );
};

const AllUsersTable = ({ flipPage, connection }) => {
  const headers = [
    "email",
    "topics",
    "logins",
    "generations",
    "blocked?",
    "joined on",
    "admin?"
  ];
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
          <h1 className="text-3xl font-bold leading-6 text-white">All Users</h1>
          <p className="mt-2 text-sm text-gray-200">
            A table with all users in our database.
          </p>
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
                </tr>
              </thead>
              <tbody className="bg-white rounded-bl-full">
                {tableItems?.map((item, i) => (
                  <TableRow key={`user ${i}`} user={item} headers={headers} />
                ))}
                {generateEmptyRows()}
              </tbody>
            </table>
            <PaginationNav
              totalItemCount={totalItemCount}
              itemType="users"
              pageInfo={pageInfo}
              flipPage={flipPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsersTable;
