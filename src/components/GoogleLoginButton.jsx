import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ loginCallback }) => {
  return (
    <div className="p-5 w-full items-center flex flex-col">
      <GoogleLogin
        shape="pill"
        text="continue_with"
        onSuccess={credentialResponse => {
          loginCallback(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default GoogleLoginButton;
