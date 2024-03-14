import { useParams } from "react-router-dom";

export default function SinglePost() {
  const { id } = useParams();

  console.log(id);

  return <div>SinglePost</div>;
}
