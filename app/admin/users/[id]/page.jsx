import React from "react";
import { UserDetailComponent } from "../../../../components/admin";

const Page = ({ params }) => {
  return <UserDetailComponent id={params.id} />;
};

export default Page;
