import React from "react";
import { GraduationCap, Hospital, Network, MapPin } from "lucide-react";
import map from "./assets/maps.webp";

const connectivityItems = [
  {
    title: "Education",
    icon: <GraduationCap className="w-6 h-6 text-maroon-600" />,
    description: "Close to top international schools & universities",
  },
  {
    title: "Healthcare",
    icon: <Hospital className="w-6 h-6 text-maroon-600" />,
    description: "Quick access to renowned hospitals & wellness centers",
  },
  {
    title: "Business & IT Hubs",
    icon: <Network className="w-6 h-6 text-maroon-600" />,
    description: "Minutes away from Gachibowli, HITEC City, and Kokapet",
  },
  {
    title: "Connected Living",
    icon: <MapPin className="w-6 h-6 text-maroon-600" />,
    description: "Access to malls, dining, ORR, metro & cultural hubs",
  },
];

const ConnectivitySection = () => {
  return (
    <section className="bg-white py-12 px-4 md:px-16 lg:px-24">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-maroon-800 text-center">
        Seamlessly Connected, <span style={{ color: '#cb8904' }}>Ideally Positioned</span>
      </h2>
      <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto text-center">
        IRIS is located in Raidurgum, Gachibowli, Hyderabad, offering seamless access to top schools, hospitals, business hubs, and leisure destinations—bringing the perfect balance to life.
      </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Info Cards */}
        <div className="space-y-6">
          {connectivityItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start p-5 rounded-xl shadow-md bg-gradient-to-br from-white to-gray-50 border hover:shadow-lg transition duration-300"
            >
              <div className="mr-4">{item.icon}</div>
              <div>
                <h4 className="text-lg font-semibold text-maroon-700">{item.title}</h4>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Map Image */}
        <div className="relative rounded-xl overflow-hidden shadow-xl">
          <img src={map}
            alt="Map"
            className="w-full h-auto object-cover rounded-lg"
          />
          <button className="absolute top-4 right-4 bg-maroon-700 text-white px-4 py-2 rounded-lg hover:bg-maroon-800 transition">
            Navigate to IRIS
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConnectivitySection;
