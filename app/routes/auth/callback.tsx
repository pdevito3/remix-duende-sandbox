import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = async ({ request }: any) => {
  // console.log({ request });

  return authenticator.authenticate("keycloak", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};