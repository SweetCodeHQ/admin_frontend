import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ loginCallback, text }) => {
  const handleLogin = async (credential) => {
    const logInfo = await loginCallback(credential)
    return logInfo
  }
  return (
    <div className="p-5 w-full items-center flex flex-col">
      <GoogleLogin
        shape="pill"
        text={text}
        onSuccess={(credentialResponse) => {
          handleLogin(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  )
};

export default GoogleLoginButton;
