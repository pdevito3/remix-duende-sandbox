import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  // console.log({ request });

  return authenticator.authenticate("duende", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};