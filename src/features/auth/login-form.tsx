import { login, loginWithOAuth, signup } from "./actions";
export default async function LoginForm({ errorMessage, successMessage }: { errorMessage?: string; successMessage?: string }) {
  return (
    <div className="flex flex-col gap-4 border items-center p-2 w-70 rounded-sm">
      <form className="flex flex-col gap-4 items-center">
        <h1 className="font-serif text-5xl py-3 pb-5 ">Welcome!</h1>
        <label className="flex flex-col w-full text-center">
          Email
          <input className="border-b m-1 focus:outline-none focus:border-blue-400" name="email" type="email" required />
        </label>
        <label className="flex flex-col w-full text-center">
          Password
          <input className="border-b m-1 focus:outline-none focus:border-blue-400" name="password" type="password" required />
        </label>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button className="cursor-pointer bg-zinc-200 text-black w-full rounded-sm p-1" formAction={login}>
          Log in
        </button>
        <button className="cursor-pointer bg-zinc-200 text-black w-full rounded-sm p-1" formAction={signup}>
          Sign up
        </button>
      </form>
      <form className="flex flex-col gap-4">
        <input type="hidden" name="provider" value="github" />
        <button className="cursor-pointer bg-zinc-200 text-black w-full rounded-sm p-1" formAction={loginWithOAuth}>
          Log in with GitHub
        </button>
      </form>
    </div>
  );
}
