import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Navigation,
  ArrowLeft,
  Plane,
  ExternalLink,
} from "lucide-react";

function MapGuide() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const from = searchParams.get("from") || "Hà Nội";
  const to = searchParams.get("to") || "TP. Hồ Chí Minh";

  const googleMapsUrl =
    "https://www.google.com/maps/dir/?api=1" +
    `&origin=${encodeURIComponent(from)}` +
    `&destination=${encodeURIComponent(to)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-10 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-blue-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <h1 className="text-3xl font-bold">
            Bản đồ chỉ đường
          </h1>

          <p className="mt-2 text-blue-100">
            Xem hành trình từ điểm đi đến điểm đến
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Hành trình
            </h2>

            <div className="mt-8">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Điểm đi
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    {from}
                  </p>
                </div>
              </div>

              <div className="ml-5 h-12 border-l-2 border-dashed border-gray-300" />

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <Navigation size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Điểm đến
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    {to}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Plane
                  size={20}
                  className="mt-0.5 text-blue-600"
                />

                <p className="text-sm leading-6 text-blue-700">
                  Bạn có thể mở Google Maps để xem đường đi
                  thực tế và hướng dẫn chi tiết.
                </p>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <ExternalLink size={18} />
              Mở Google Maps
            </a>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="relative h-[550px] overflow-hidden bg-slate-100">
              <div className="absolute inset-0 opacity-60">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                  }}
                />
              </div>

              <div className="absolute left-[12%] top-[25%] h-40 w-40 rounded-full border-4 border-blue-200" />

              <div className="absolute right-[15%] bottom-[20%] h-48 w-48 rounded-full border-4 border-green-200" />

              <div className="absolute left-[18%] top-[31%] flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg">
                <div className="rounded-full bg-blue-600 p-2 text-white">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Điểm đi
                  </p>

                  <p className="font-bold text-gray-900">
                    {from}
                  </p>
                </div>
              </div>

              <div className="absolute right-[18%] bottom-[27%] flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg">
                <div className="rounded-full bg-green-600 p-2 text-white">
                  <Navigation size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Điểm đến
                  </p>

                  <p className="font-bold text-gray-900">
                    {to}
                  </p>
                </div>
              </div>

              <svg
                viewBox="0 0 800 550"
                className="absolute inset-0 h-full w-full"
              >
                <path
                  d="M180 180 C 300 120, 350 380, 620 390"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeDasharray="12 10"
                />

                <circle
                  cx="180"
                  cy="180"
                  r="9"
                  fill="#2563eb"
                />

                <circle
                  cx="620"
                  cy="390"
                  r="9"
                  fill="#16a34a"
                />

                <g transform="translate(375,270) rotate(25)">
                  <path
                    d="M0 -18 L7 8 L0 4 L-7 8 Z"
                    fill="#2563eb"
                  />
                </g>
              </svg>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl bg-white px-5 py-3 text-center shadow-lg">
                <p className="text-xs text-gray-500">
                  Tuyến đường
                </p>

                <p className="font-bold text-gray-900">
                  {from} → {to}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapGuide;