import LoginRedirect from "../../components/LoginRedirect";

export default function LoginLayout({ children }) {
  return (
    <LoginRedirect>
      {children}
    </LoginRedirect>
  );
}

