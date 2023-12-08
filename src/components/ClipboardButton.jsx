import { useState, useEffect } from "react"
import { Tooltip } from '../components'
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';

const ClipboardButton = ({editModeEnabled, displayedTopic, displayedAbstract, keywords}) => {

  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setClicked(false);
    }, 3000);
    }, [clicked]);

  const handleCopyToClipboard = () => {
    const displayKeywords = keywords.map((word) => word.word.toUpperCase())
    
    navigator.clipboard.writeText(`Topic: ${displayedTopic}\nAbstract: ${displayedAbstract ? displayedAbstract : 'None generated'}\nKeywords used: ${displayKeywords}\nCurio by Fixate.io`)
    setClicked(true)
  }
  return (
    <button
        onClick={handleCopyToClipboard}
        className={`mt-2 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
          editModeEnabled ? 'invisible' : null
          }`}
        >
        {clicked ? (
            <ClipboardDocumentCheckIcon
                onClick={handleCopyToClipboard}
                className="h-6 w-6 text-green-400"
                aria-hidden="true"
            />
        ) : (
                <Tooltip text="Copy to Clipboard">
                    <ClipboardDocumentIcon
                    onClick={handleCopyToClipboard}
                    className="h-6 w-6 text-blue-300"
                    aria-hidden="true"
                    />
                </Tooltip>
                )
        }
        </button>
  )
}

export default ClipboardButton