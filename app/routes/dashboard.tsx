import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserDisplayName, getUserId } from "~/session.server";

type LoaderData = {
  userName: string | null;
};

export async function loader({ request }: any) {
  // const userId = await getUserId(request);

  // console.log({ userId });
  const myName = await getUserDisplayName(request);
  console.log({ myName });

  const data: LoaderData = {
    userName: myName,
  };

  return json(data);
}

export default function Dashboard() {
  const data = useLoaderData<LoaderData>();
  
  return (
    <div className="p-5">
      {/* <a href="https://localhost:3385/account/logout">Logout</a> */}
      <p>Hi, {data.userName}!</p>
      <Link to="/logout">Logout</Link>
    </div>
  )
}