import { useState, useEffect } from "react";

const PaginationNav = ({ totalItemCount, itemType, pageInfo, flipPage }) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [total, setTotal] = useState(() => totalItemCount);

  useEffect(() => {
    setCurrentPageNumber(1);
  }, [totalItemCount]);

  const handleFlipForward = () => {
    flipPage({
      after: pageInfo.endCursor
    });
    setCurrentPageNumber(prev => (prev += 1));
  };

  const handleFlipBackward = () => {
    flipPage({
      last: 10,
      before: pageInfo.startCursor
    });
    setCurrentPageNumber(prev => (prev -= 1));
  };

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-[#3A1F5C] px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-white">
          Showing <span className="font-medium">Page {currentPageNumber}</span>{" "}
          of{" "}
          <span className="font-medium">
            {Math.ceil(totalItemCount / 10) || 1}
          </span>{" "}
          <span className="font-medium">({totalItemCount}</span> {itemType})
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={handleFlipBackward}
          className={`relative inline-flex items-center mr-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#3A1F5C] ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 transition delay-50 ease-in-out hover:scale-105 ${
            pageInfo?.hasPreviousPage ? null : "invisible"
          }`}
        >
          Back
        </button>

        {pageInfo?.hasNextPage && (
          <button
            onClick={handleFlipForward}
            className={`relative inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#3A1F5C] ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 transition delay-50 ease-in-out hover:scale-105 ${
              pageInfo?.hasNextPage ? null : "invisible"
            }`}
          >
            Next
          </button>
        )}
      </div>
    </nav>
  );
};

export default PaginationNav;
