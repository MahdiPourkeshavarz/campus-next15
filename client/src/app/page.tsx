import { BASE_URL, HOME_URL } from "@/constants";

export default async function Home() {
  const data = await loader();

  return (
    <>
      <div>
        <p>{data.description}</p>
      </div>
    </>
  );
}

async function loader() {
  const url = new URL(HOME_URL, BASE_URL);

  const response = await fetch(url.href);
  const data = await response.json();

  return { ...data.data };
}
