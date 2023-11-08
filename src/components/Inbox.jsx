import { TopicRow } from "../components"
import { AiOutlineClose } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";

const Inbox = ({setToggleInbox}) => {
    //redo topic row so that userId is internal (useContext)
    //where do the keywordIds come from?
    //refetchUserTopics in the topicDashboard
  return (
    <ul className="z-10 overflow-y-auto overflow-x-clip fixed top-0 p-3 -right-2 w-3/5 h-[100vw] sm:h-[55vh] md:h-[55vw] lg:h-[40vw] shadow-2xl list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
        <div className="flex w-full justify-between h-full">
        <div></div>
        <div>
          <h1 className="w-full text-center font-extrabold text-3xl">
            Your Inbox
          </h1>
          <p className="mt-1 text-center">Topics curated just for you. BETA</p>
          {/* {true && (
            <p className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-5 font-bold self-center">
              Check back soon for more intelligently curated topics!
            </p>
          )} */}
          <div>
          <div className="flex mt-5">
          <button className="text-white text-2xl border-[1px] border-none outline-none rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-400 pr-5" >
            <MdDeleteForever />
          </button>
            <TopicRow topic={"...I am a topic of sufficient length that I seem like a real topic."} userId={null} i={3} refetch={null} keywordIds ={null} />
          </div>
            <p className="text-center mt-10">Topics will be automatically deleted after 3 days.</p>
            </div>
        </div>
        <AiOutlineClose
          fontSize={28}
          className="text-white cursor-pointer mb-5"
          onClick={() => setToggleInbox(false)}
        />
      </div>
    </ul>
  )
}

export default Inbox;