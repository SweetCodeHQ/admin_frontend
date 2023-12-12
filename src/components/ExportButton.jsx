import { useState, useContext } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { ExportAlert, Tooltip } from '.';
import { UserContext } from '../context';

const ExportButton = ({
  editModeEnabled,
  displayedTopic,
  displayedAbstract,
  keywords,
}) => {
  const { setGToken } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showExportAlert, setShowExportAlert] = useState(false);

  const [docId, setDocId] = useState(null);

  const formatKeywords = () => {
    let display = '';
    keywords.map((keyword) => (display += `${keyword}, `));
    return display.substring(0, display.length - 2);
  };

  const displayedKeywords = formatKeywords();

  const handleClick = () => {
    window.dataLayer.push({
      event: 'google_doc_export',
      topic: displayedTopic,
    });
    handleAccessToken();
  };

  const handleSuccessfulToken = async (tokenResponse) => {
    setIsLoading(true);
    setShowExportAlert(true);
    setGToken(tokenResponse);
    const doc = await exportGoogleDoc(tokenResponse);
    setIsLoading(false);
  };

  const handleAccessToken = useGoogleLogin({
    onSuccess: (tokenResponse) => handleSuccessfulToken(tokenResponse),
    scope: 'https://www.googleapis.com/auth/documents',
    flow: 'implicit',
  });

  const exportGoogleDoc = async (token) => {
    const promise = await handleCreateGoogleDoc(token);
    handleAddTextToDoc(promise, token);
  };

  const handleCreateGoogleDoc = async (token) => {
    let documentId;
    const url = 'https://docs.googleapis.com/v1/documents';

    const fetch_options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `CURIO: ${displayedTopic}`,
      }),
    };

    await fetch(url, fetch_options)
      .then((response) => response.json())
      .then((response) => {
        documentId = response.documentId;
      });
    setDocId(documentId);
    return documentId;
  };

  const handleAddTextToDoc = (documentId, token) => {
    const exportedAbstract = displayedAbstract || 'No abstract generated.'

    const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
    const fetch_options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              text: `\nGenerated with Curio by Fixate.\nNeed help writing this content? Visit https://fixate.io/contact to get in touch.`,
              location: {
                index: 1,
              },
            },
          },
          {
            updateTextStyle: {
              textStyle: {
                link: {
                  url: 'https://fixate.io/contact',
                },
              },
              fields: 'link',
              range: {
                startIndex: 72,
                endIndex: 97,
              },
            },
          },
          {
            insertInlineImage: {
              location: {
                index: 1,
              },
              uri: 'https://fixate.io/wp-content/uploads/2021/10/Fixate-Logo-RGB1-e1422906323203@2x.png',
              objectSize: {
                height: {
                  magnitude: 144,
                  unit: 'PT',
                },
                width: {
                  magnitude: 155,
                  unit: 'PT',
                },
              },
            },
          },
          {
            updateParagraphStyle: {
              paragraphStyle: {
                alignment: 'CENTER',
              },
              fields: 'alignment',
              range: {
                startIndex: 3,
                endIndex: 100,
              },
            },
          },
          {
            insertText: {
              text: `Keywords: ${displayedKeywords}\n\n`,
              location: {
                index: 1,
              },
            },
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: true,
              },
              fields: 'bold',
              range: {
                startIndex: 1,
                endIndex: 10,
              },
            },
          },
          {
            updateParagraphStyle: {
              paragraphStyle: {
                alignment: 'CENTER',
              },
              fields: 'alignment',
              range: {
                startIndex: displayedKeywords.length + 13,
                endIndex: displayedKeywords.length + 14,
              },
            },
          },
          {
            insertText: {
              text: `${exportedAbstract}\n\n`,
              location: {
                index: 1,
              },
            },
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: false,
              },
              fields: 'bold',
              range: {
                startIndex: 1,
                endIndex: exportedAbstract.length + 1 || 2,
              },
            },
          },
          {
            insertText: {
              text: `Abstract:\n`,
              location: {
                index: 1,
              },
            },
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: true,
              },
              fields: 'bold',
              range: {
                startIndex: 1,
                endIndex: 10,
              },
            },
          },
          {
            insertText: {
              text: `${displayedTopic}\n\n`,
              location: {
                index: 1,
              },
            },
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: false,
              },
              fields: 'bold',
              range: {
                startIndex: 1,
                endIndex: displayedTopic?.length + 1 || 2,
              },
            },
          },
          {
            insertText: {
              text: `Working Title:\n`,
              location: {
                index: 1,
              },
            },
          },
          {
            updateTextStyle: {
              textStyle: {
                bold: true,
              },
              fields: 'bold',
              range: {
                startIndex: 1,
                endIndex: 14,
              },
            },
          },
        ],
      }),
    };

    fetch(url, fetch_options)
  };

  return (
    <>
      <ExportAlert
        showExportAlert={showExportAlert}
        setShowExportAlert={setShowExportAlert}
        docId={docId}
        isLoading={isLoading}
      />
      <div className={`mt-1 mx-auto flex ${editModeEnabled ? 'invisible' : null}`}>
        <Tooltip text="Export to Google Docs">
          <GoogleLogin 
            type="icon" 
            shape="circle"
            theme="filled_blue"
            onSuccess={handleClick}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default ExportButton;
