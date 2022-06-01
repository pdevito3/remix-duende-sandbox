import { Link } from "@remix-run/react";
import { getSession } from "~/session.server";
import { authenticator } from "~/utils/auth.server";

// export async function loader({ request }: any) {
//   const session = await getSession();

// console.log(session.data)

//   // if (session.has("userId")) {
//   //   // Redirect to the home page if they are already signed in.
//   //   return redirect("/");
//   // }

//   // const data = { error: session.get("error") };

// return null;

//   // return json(data, {
//   //   headers: {
//   //     "Set-Cookie": await commitSession(session),
//   //   },
//   // });
// }

export default function Dashboard() {
  // authenticator.isAuthenticated();

  return (
    <div className="p-5">
      {/* <a href="https://localhost:3385/account/logout">Logout</a> */}
      <p>Hi, you!</p>
      <Link to="/logout">Logout</Link>
    </div>
  )
}