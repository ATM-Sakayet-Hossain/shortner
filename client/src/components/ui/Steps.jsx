import React from "react";

const Steps = () => {
  const steps = [
    {
      id: 1,
      title: "Enter Long URL",
      des: "You paste a long website link into the input field and submit it.",
    },
    {
      id: 2,
      title: "URL Gets Shortened",
      des: "Our system generates a unique short code and maps it to your original URL.",
    },
    {
      id: 3,
      title: "Redirect Happens",
      des: "When someone clicks the short link, they are instantly redirected to the original long URL.",
    },
  ];
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How Does a Short URL Work?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                {item.id}. {item.title}
              </h3>
              <p className="text-gray-600">{item.des}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
