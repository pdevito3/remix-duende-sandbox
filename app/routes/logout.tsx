import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "../session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  // make a GET fetch request to https://localhost:3385/account/logout
  // fetch("https://localhost:3385/account/logout", {
  //   method: "POST",
  // })

  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};