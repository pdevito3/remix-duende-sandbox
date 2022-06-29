export default function Login() {
  return (
    <form action="/auth/keycloak" method="post">
      <button>Login with Keycloak</button>
    </form>
  );
}