import { useState, useContext, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { ExportAlert } from "../components";
import { UserContext } from "../context";
import { DocumentArrowUpIcon } from "@heroicons/react/24/solid";

const ExportButton = ({
  editModeEnabled,
  displayedTopic,
  displayedAbstract
}) => {
  const { gToken, setGToken } = useContext(UserContext);

  const [showExportAlert, setShowExportAlert] = useState(false);
  const [docId, setDocId] = useState(null);

  const handleClick = () => {
    handleAccessToken();
  };

  const handleSuccessfulToken = async tokenResponse => {
    setGToken(tokenResponse);
    const doc = await exportGoogleDoc(tokenResponse);
    setShowExportAlert(true);
  };

  const handleAccessToken = useGoogleLogin({
    onSuccess: tokenResponse => handleSuccessfulToken(tokenResponse),
    scope: "https://www.googleapis.com/auth/documents",
    flow: "implicit"
  });

  const exportGoogleDoc = async token => {
    const promise = await handleCreateGoogleDoc(token);
    await handleAddTextToDoc(promise, token);
  };

  const handleCreateGoogleDoc = async token => {
    let documentId;
    const url = "https://docs.googleapis.com/v1/documents";

    const fetch_options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `CURIO: ${displayedTopic}`
      })
    };

    await fetch(url, fetch_options)
      .then(response => response.json())
      .then(response => {
        documentId = response.documentId;
      });
    setDocId(documentId);
    return documentId;
  };

  const handleAddTextToDoc = (documentId, token) => {
    const abstractText = displayedAbstract || "Abstract not yet generated";

    const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
    const fetch_options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              text: `\nGenerated with Curio by Fixate.\nNeed help writing this content? Visit https://fixate.io/contact to get in touch.`,
              location: {
                index: 1
              }
            }
          },
          {
            updateTextStyle: {
              textStyle: {
                link: {
                  url: "https://fixate.io/contact"
                }
              },
              fields: "link",
              range: {
                startIndex: 72,
                endIndex: 97
              }
            }
          },
          {
            updateParagraphStyle: {
              paragraphStyle: {
                alignment: "CENTER"
              },
              fields: "alignment",
              range: {
                startIndex: 5,
                endIndex: 100
              }
            }
          },
          {
            insertText: {
              text: `Published on Website: [Add Date and URL here when available]\n\n
              `,
              location: {
                index: 1
              }
            }
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: true
              },
              fields: "bold",
              range: {
                startIndex: 1,
                endIndex: 61
              }
            }
          },
          {
            insertText: {
              text: `Keywords:\n\n`,
              location: {
                index: 1
              }
            }
          },
          {
            insertText: {
              text: `Target Audience:\n\n`,
              location: {
                index: 1
              }
            }
          },
          {
            insertText: {
              text: `Type of Content:\n\n`,
              location: {
                index: 1
              }
            }
          },
          {
            insertText: {
              text: `${displayedAbstract}\n\n`,
              location: {
                index: 1
              }
            }
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: false
              },
              fields: "bold",
              range: {
                startIndex: 1,
                endIndex: displayedAbstract.length + 1
              }
            }
          },
          {
            insertText: {
              text: `Abstract:\n`,
              location: {
                index: 1
              }
            }
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: true
              },
              fields: "bold",
              range: {
                startIndex: 1,
                endIndex: 10
              }
            }
          },
          {
            insertText: {
              text: `${displayedTopic}\n\n`,
              location: {
                index: 1
              }
            }
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: false
              },
              fields: "bold",
              range: {
                startIndex: 1,
                endIndex: displayedTopic.length + 1
              }
            }
          },
          {
            insertText: {
              text: `Working Title:\n`,
              location: {
                index: 1
              }
            }
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: true
              },
              fields: "bold",
              range: {
                startIndex: 1,
                endIndex: 14
              }
            }
          },
          {
            insertInlineImage: {
              location: {
                index: 1
              },
              uri:
                "https://fixate.io/wp-content/uploads/2021/10/Fixate-Logo-RGB1-e1422906323203@2x.png"
            }
          }
        ]
      })
    };

    fetch(url, fetch_options)
      .then(response => response.json())
      .then(response => {
        console.log(response);
      });
  };

  return (
    <>
      <ExportAlert
        showExportAlert={showExportAlert}
        setShowExportAlert={setShowExportAlert}
        docId={docId}
      />
      <button
        onClick={handleClick}
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
          editModeEnabled ? "invisible" : null
        }`}
      >
        <DocumentArrowUpIcon
          className="h-6 w-6 editModeEnabled ? text-blue-300"
          aria-hidden="true"
        />
      </button>
    </>
  );
};

export default ExportButton;
