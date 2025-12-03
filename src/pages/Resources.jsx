import bannerImg from "../assets/vu_banner.jpg"; 
export default function Resources() {
  return (
    <div className="min-h-[60vh] px-6 py-4">
      {/* Banner */}
        <div className="w-full h-72 rounded-xl overflow-hidden mb-8 shadow-md">
          <img
           src={bannerImg}
           alt="Villanova Banner"
           className="w-full h-full object-cover"
          />
        </div>

      <h1 className="text-4xl font-extrabold text-blue-700 mb-6">
        Resources
      </h1>

      {/* Parking Policies */}
      <section className="mb-10 bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Parking Policies
        </h2>
        <ul className="space-y-2 text-blue-600 underline">
          <li>
            <a
              href="https://www1.villanova.edu/university/parking-transportation/regulations.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Parking Regulations
            </a>
          </li>
          <li>
            <a
              href="https://www1.villanova.edu/university/parking-transportation/registration/student-parking.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Student Parking Information
            </a>
          </li>
        </ul>
      </section>

      {/* Shuttle & Transportation */}
      <section className="mb-10 bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Shuttle & Transportation
        </h2>
        <ul className="space-y-2 text-blue-600 underline">
          <li>
            <a
              href="https://www1.villanova.edu/university/parking-transportation/on-campus.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              On-Campus Transportation
            </a>
          </li>
          <li>
            <a
              href="https://www1.villanova.edu/university/parking-transportation/off-campus.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Off-Campus Transportation
            </a>
          </li>
          <li>
            <a
              href="https://www1.villanova.edu/university/parking-transportation.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Parking & Transportation Home Page
            </a>
          </li>
        </ul>
      </section>

      {/* Campus Map */}
      <section className="bg-white shadow-sm rounded-xl p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Campus Map
        </h2>
        <a
          href="https://virtualvisit.villanova.edu/#ctdl-GMAP_20210823161712767,ULAY_20220926182809488"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Interactive Villanova Campus Map
        </a>
      </section>

      {/* FAQ Section */}
      <section className="mb-10 bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          <details className="bg-gray-100 p-3 rounded-lg cursor-pointer">
            <summary className="font-medium text-gray-700">
              Where can I park as a student?
            </summary>
            <p className="mt-2 text-gray-600">
              Students may park in designated student lots such as S-4 or I-1
              depending on permit type. Always follow posted signage.
            </p>
          </details>

          <details className="bg-gray-100 p-3 rounded-lg cursor-pointer">
            <summary className="font-medium text-gray-700">
              Can I park without a permit?
            </summary>
            <p className="mt-2 text-gray-600">
              A valid Villanova parking permit is required in most areas.
              Visitors should use marked visitor parking or obtain a temporary
              pass.
            </p>
          </details>

          <details className="bg-gray-100 p-3 rounded-lg cursor-pointer">
            <summary className="font-medium text-gray-700">
              How do I find the campus map?
            </summary>
            <p className="mt-2 text-gray-600">
              Villanova’s interactive campus map can be found above.
            </p>
          </details>
        </div>
      </section>


    </div>
  );
}