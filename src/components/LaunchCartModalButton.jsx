import 'tw-elements';

const LaunchCartModalButton = ({
  headerText,
  bodyText,
  submitButtonText,
  initialButtonText,
  handleClick,
}) => (
  <>
    <button
      type="button"
      className="pr-5 pl-5 p-2 mt-2 text-[#2D104F] bg-white font-bold text-base leading-tight rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg hover:text-white transition duration-150 ease-in-out"
      data-bs-toggle="modal"
      data-bs-target="#submitTopicsConfirmation"
    >
      {initialButtonText}
    </button>
    <div
      className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
      id="submitTopicsConfirmation"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog relative w-auto pointer-events-none">
        <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md rounded-t-lg outline-none text-current">
          <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-[#2D104F]">
            <h5
              className="text-xl font-medium leading-normal text-white"
              id="exampleModalLabel"
            >
              {headerText}
            </h5>
            <button
              type="button"
              className="btn-close box-content w-4 h-4 p-1 bg-white text-white border-none rounded-full opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body relative p-4 text-black bg-purple-100">
            {bodyText}
          </div>
          <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md bg-purple-300">
            <button
              type="button"
              className="px-6 py-2.5 bg-white text-[#2D104F] font-bold text-sm leading-tight uppercase rounded-full shadow-md hover:shadow-lg focus:bg-purple-700 focus:shadow-lg line-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-105"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1 hover:-translate-y-1 hover:scale-105"
              data-bs-dismiss="modal"
              onClick={handleClick}
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LaunchCartModalButton;
