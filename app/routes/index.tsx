export default function Index() {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Welcome to Remix</h1>
      <a href="/login">Login</a>

      <form action="/auth/duende" method="post">
        <button>Login with Duende</button>
      </form>
    </div>
  );
}