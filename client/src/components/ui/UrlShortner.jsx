import Button from "./Button";
import Input from "./Input";
import { Link } from "react-router";
const UrlShortner = () => {

  return (
    <section className="flex flex-col items-center justify-center px-4 py-20 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Shorten Your Long URLs
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Paste your long URL below and get a short, shareable link in seconds.
      </p>

      <form className="w-full max-w-xl flex gap-2">
        <Input
          size="lg"
          type="url"
          required
          placeholder="Enter your long URL here..."
        />
        <Button type="submit">Shorten</Button>
      </form>

        <div className="mt-6 w-full max-w-xl bg-gray-100 p-4 rounded-md flex items-center justify-between">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium truncate"
          >
            shortUrl
          </Link>
          <Button variant="secondary">
            "Copied!" "Copy"
          </Button>
        </div>
    </section>
  );
};

export default UrlShortner;
