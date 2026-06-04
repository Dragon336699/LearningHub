import React, { useEffect, useState } from "react";
import {
  fetchExpertises,
  searchMentors,
} from "../../../store/thunks/userThunks";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useNavigate } from "react-router-dom";

export const FindMentorPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [expertises, setExpertises] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [selectedExpertiseIds, setSelectedExpertiseIds] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const initData = async () => {
      const actionResult = await dispatch(fetchExpertises());
      if (fetchExpertises.fulfilled.match(actionResult)) {
        setExpertises(actionResult.payload);
      }
    };
    initData();
  }, [dispatch]);

  useEffect(() => {
    const fetchFilteredMentors = async () => {
      setIsLoading(true);
      const actionResult = await dispatch(
        searchMentors({
          keyword,
          expertiseIds: selectedExpertiseIds,
        }),
      );

      if (searchMentors.fulfilled.match(actionResult)) {
        setMentors(actionResult.payload);
      }
      setIsLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredMentors();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, selectedExpertiseIds, dispatch]);

  const toggleExpertise = (id: string) => {
    setSelectedExpertiseIds((prev) =>
      prev.includes(id) ? prev.filter((expId) => expId !== id) : [...prev, id],
    );
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-900 p-6 min-h-screen text-gray-200">
      <header className="p-4 border-b border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-xl">Find a Mentor</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search mentors by name..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Areas of Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {expertises.map((exp) => {
                const isSelected = selectedExpertiseIds.includes(exp.id);
                return (
                  <button
                    key={exp.id}
                    onClick={() => toggleExpertise(exp.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      isSelected
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {exp.expertiseName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Available Mentors{" "}
            {isLoading && (
              <span className="text-sm text-gray-400 ml-2">(Finding mentors...)</span>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.length === 0 && !isLoading && (
              <p className="text-gray-400">No mentors found.</p>
            )}

            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start">
                    <img
                      src={
                        mentor.avatarUrl ||
                        "https://randomuser.me/api/portraits/lego/1.jpg"
                      }
                      alt={`${mentor.firstName} ${mentor.lastName || ""}`}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{`${mentor.firstName} ${mentor.lastName || ""}`}</h3>
                      <p className="text-gray-400">
                        {mentor.roleName || "Mentor"}
                      </p>
                      <p className="text-orange-400 text-sm mt-1 font-semibold">
                        {mentor.coachCost
                          ? `${mentor.coachCost.toLocaleString("en-US")} $/h`
                          : "Free"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertises && mentor.expertises.length > 0 ? (
                        mentor.expertises.map((exp: any) => (
                          <span
                            key={exp.id}
                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs"
                          >
                            {exp.expertiseName}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs italic">
                          Not updated
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {mentor.bio || "No bio."}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 flex justify-between">
                    <button
                      onClick={() => navigate(`/profile/${mentor.id}`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                    >
                      View Profile
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </main>
  );
};

export default FindMentorPage;
