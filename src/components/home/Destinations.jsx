const destinations = [
  {
    name: "Hà Nội",
    description: "Thủ đô ngàn năm văn hiến",
    image:
      "https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Đà Nẵng",
    description: "Thành phố biển hiện đại",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "TP. Hồ Chí Minh",
    description: "Thành phố năng động và sôi động",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
  },
];

function Destinations() {
  return (
    <section id="destinations" className="py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <p className="font-semibold text-blue-600">
            ĐIỂM ĐẾN
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Điểm đến phổ biến
          </h2>

          <p className="mt-4 text-gray-600">
            Khám phá những địa điểm hấp dẫn tại Việt Nam.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {destinations.map((destination) => (
            <div
              key={destination.name}
              className="group relative h-80 overflow-hidden rounded-2xl"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">
                  {destination.name}
                </h3>

                <p className="mt-2">
                  {destination.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Destinations;