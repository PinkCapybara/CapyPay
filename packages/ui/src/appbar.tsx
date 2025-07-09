import { Button } from "./button";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSignin: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSignout: any;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="flex justify-between border-b border-slate-300 px-4">
      <div className="flex flex-col justify-center text-4xl font-bold">
        CapyPAY
      </div>
      <div className="flex flex-col justify-center pt-2">
        <Button onClick={user ? onSignout : onSignin}>
          {user ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
};
