import { Plane, Hotel, Car } from "lucide-react";

const services = [
  {
    title: "Chuyến bay",
    description: "Tìm kiếm và lựa chọn chuyến bay phù hợp với hành trình của bạn.",
    icon: Plane,
  },
  {
    title: "Khách sạn",
    description: "Đặt phòng khách sạn với nhiều lựa chọn tiện nghi.",
    icon: Hotel,
  },
  {
    title: "Đưa đón",
    description: "Dịch vụ taxi và xe đưa đón sân bay thuận tiện.",
    icon: Car,
  },
];

function Services() {
  return (
    <section id="services" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <p className="font-semibold text-blue-600">
            DỊCH VỤ
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Mọi thứ bạn cần cho chuyến đi
          </h2>

          <p className="mt-4 text-gray-600">
            TravelGo giúp bạn tìm kiếm và đặt các dịch vụ du lịch
            một cách nhanh chóng và thuận tiện.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 w-fit rounded-xl bg-blue-100 p-4 text-blue-600">
                  <Icon size={32} />
                </div>

                <h3 className="text-xl font-bold">
                  {service.title}
                </h3>

                <p className="mt-3 text-gray-600">
                  {service.description}
                </p>

                <button className="mt-5 font-semibold text-blue-600">
                  Khám phá →
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default Services;