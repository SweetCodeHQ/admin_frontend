import { BiFilter } from 'react-icons/bi';
import { FILTERS } from '../constants/filters';

const Filter = ({ name, setFilterTopicsBy, filterTopicsBy }) => (
  <li>
    <a
      className={`
          dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white focus:text-white focus:bg-gray-700
        `}
      onClick={(e) => setFilterTopicsBy(name)}
    >
      {name}
    </a>
  </li>
);

const TopicFilter = ({ setFilterTopicsBy, filterTopicsBy }) => {
  const shownFilters = FILTERS.filter((filter) => filter !== filterTopicsBy);

  return (
    <div className="dropdown relative">
      <button
        className="dropdown-toggle bg-[#2D104F] p-1 text-5xl text-white rounded-full shadow-md hover:bg-white hover:text-[#2D104F] hover:shadow-lg focus:bg-white focus:text-[#2D104F] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-white active:shadow-lg active:text-[#2D104F] transition duration-150 ease-in-out flex items-center"
        type="button"
        id="dropdownMenuButton3"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <BiFilter />
      </button>
      <ul
        className="dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-gray-800"
        aria-labelledby="dropdownMenuButton3"
      >
        {shownFilters.map((name, i) => (
          <Filter
            key={i}
            setFilterTopicsBy={setFilterTopicsBy}
            name={name}
            filterTopicsBy={filterTopicsBy}
          />
        ))}
      </ul>
    </div>
  );
};

export default TopicFilter;
