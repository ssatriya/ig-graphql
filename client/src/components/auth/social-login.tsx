import { Button } from "../ui/button";

const SocialLogin = () => {
  const onClick = (providers: "google" | "github") => {
    if (providers === "google") {
      window.location.replace(
        `${import.meta.env.VITE_BACKEND_SERVER}/api/login/google`
      );
    } else if (providers === "github") {
      window.location.replace("/api/login/github");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onClick("google")}
        className="w-full text-xs bg-primary"
        size="sm"
        aria-label="Login with Google"
      >
        Log in with Google
      </Button>
      <Button
        disabled
        onClick={() => onClick("github")}
        className="w-full text-xs bg-primary"
        size="sm"
        aria-label="Login with Github"
      >
        Log in with Github
      </Button>
    </div>
  );
};

export default SocialLogin;
