import { Plane, Hotel, Car } from "lucide-react";

const services = [
  {
    title: "Chuyến bay",
    description:
      "Tìm kiếm và lựa chọn chuyến bay phù hợp với hành trình của bạn.",
    icon: Plane,
  },
  {
    title: "Khách sạn",
    description:
      "Đặt phòng khách sạn với nhiều lựa chọn tiện nghi.",
    icon: Hotel,
  },
  {
    title: "Đưa đón",
    description:
      "Dịch vụ taxi và xe đưa đón sân bay thuận tiện.",
    icon: Car,
  },
];

function Services() {
  return (
    <section
      id="services"
      className="bg-gray-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            DỊCH VỤ
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
            Mọi thứ bạn cần cho chuyến đi
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
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
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={32} />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {service.description}
                </p>

                <button
                  type="button"
                  className="mt-6 font-semibold text-blue-600 transition hover:text-blue-800"
                >
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