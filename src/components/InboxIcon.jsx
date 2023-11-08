import { useState, useContext } from "react"
import { UserContext } from "../context";
import { BsInbox } from "react-icons/bs"
import { Inbox } from "../components"

const InboxIcon = () => {
    const [toggleInbox, setToggleInbox] = useState(true)
    const { megaphoneUserInfo } = useContext(UserContext);

    return (
      <>
        {!megaphoneUserInfo?.isAdmin && (
          <div className="flex">
            <BsInbox className="text-4xl cursor-pointer text-white" onClick={() => setToggleInbox(true)} />
            {true && (
              <h4 className="text-red-800 text-xl rounded-full font-extrabold pl-2 pr-2 h-4/5 -translate-y-3 z-5 bg-yellow-400">
                5
              </h4>
            )}
          {toggleInbox && <Inbox setToggleInbox={setToggleInbox} />}
          </div>
        )}
        </>
  )
}

export default InboxIcon;
