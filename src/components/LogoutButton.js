import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  // Determine the return URL based on the environment
  const returnToUrl =
    process.env.NODE_ENV === "production"
      ? "https://my-task-checker.vercel.app/" // Replace with your actual Vercel URL
      : window.location.origin;

  console.log("Return to URL:", returnToUrl);

  return (
    <button onClick={() => logout({ returnTo: returnToUrl })}> Log Out </button>
  );
};

export default LogoutButton;
