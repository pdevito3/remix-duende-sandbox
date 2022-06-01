import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = () => redirect("/login");

export let action: ActionFunction = async ({ request }) => {
  let user = await authenticator.authenticate("duende", request);
  // console.log("it's a user", {user})
  return user;
};