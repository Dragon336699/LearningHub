import { 
  ChevronLeft, 
  Star, 
  Calendar, 
  Clock, 
  CreditCard,
  MessageSquare
} from "lucide-react";
import { User } from "../../../types/user";
import { Experience } from "../../../types/experience";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserById } from "../../../store/thunks/userThunks";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateUser } from "../../../store/slices/userSlice";

const expertiseOptions = [
  "Programming",
  "Design",
  "Leadership",
  "Data Science",
  "Project Management",
  "Marketing",
  "Business",
  "Communication",
];

const learningStyleOptions = ["Visual (seeing)", "Auditory (hearing)", "Reading/Writing", "Kinesthetic (doing)"];
const availabilityOptions = ["Weekdays", "Weekends", "Mornings", "Afternoons", "Evenings"];
const communicationOptions = ["Video Call", "Audio Call", "Text Chat"];
const topicOptions = [
  "Career Development",
  "Technical Skill",
  "Leadership",
  "Communication",
  "Work-Life Balance",
  "Industry Insights",
  "Networking",
  "Entrepreneurship",
];

interface ProfileSettings {
  learningStyles: string[];
  availability: string[];
  communicationMethods: string[];
  topicsOfInterest: string[];
  hopeToLearn: string;
  sessionFrequency: string;
  sessionDuration: string;
  privateProfile: boolean;
  allowMessages: boolean;
  receiveNotifications: boolean;
}

export const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("About");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [fullNameInput, setFullNameInput] = useState("");
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    description: "",
    skills: "",
    industryExperience: "",
    selectedExpertiseNames: [] as string[],
    experiences: [] as Experience[],
  });

  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    learningStyles: [learningStyleOptions[0]],
    availability: [availabilityOptions[0]],
    communicationMethods: [communicationOptions[0]],
    topicsOfInterest: [topicOptions[1]],
    hopeToLearn: "",
    sessionFrequency: "Weekly",
    sessionDuration: "1 Hour",
    privateProfile: false,
    allowMessages: true,
    receiveNotifications: true,
  });

  const formStorageKey = user ? `profile-settings-${user.id}` : null;

  const getRandomId = () => {
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);
  };

  const resetFormState = () => {
    if (!user) return;

    const fName = user.firstName || "";
    const lName = user.lastName || "";

    setFormState({
      firstName: fName,
      lastName: lName,
      phoneNumber: user.phoneNumber || "",
      description: user.description || "",
      skills: user.skills || "",
      industryExperience: user.experiences?.[0]?.title || "",
      selectedExpertiseNames: user.expertises?.map((expertise) => expertise.expertiseName) || [],
      experiences: user.experiences || [],
    });

    setFullNameInput(lName ? `${fName} ${lName}` : fName);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!user) return;
    resetFormState();

    if (!formStorageKey) return;
    const saved = localStorage.getItem(formStorageKey);
    if (saved) {
      try {
        setProfileSettings(JSON.parse(saved));
      } catch {
        // ignore invalid saved settings
      }
    }
  }, [user, formStorageKey]);

  const updateFormField = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleProfileSetting = (field: keyof ProfileSettings, value: string) => {
    setProfileSettings((prev) => {
      const current = prev[field];
      if (!Array.isArray(current)) return prev;

      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };

  const handleCancel = () => {
    resetFormState();
    setIsEditOpen(false);
  };

  const handleSave = () => {
    if (!user) return;

    const updatedExpertises = formState.selectedExpertiseNames.map((name) => {
      const existing = user.expertises.find((expertise) => expertise.expertiseName === name);
      return existing ?? { id: getRandomId(), expertiseName: name };
    });

    const newExperiences = formState.experiences.length > 0
      ? formState.experiences.map((experience, index) => {
          if (index === 0) {
            return {
              ...experience,
              title: formState.industryExperience || experience.title,
            };
          }
          return experience;
        })
      : [
          {
            id: getRandomId(),
            title: formState.industryExperience || "Industry Experience",
            description: "",
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
          },
        ];

    const updatedUser: User = {
      ...user,
      firstName: formState.firstName,
      lastName: formState.lastName,
      phoneNumber: formState.phoneNumber,
      description: formState.description,
      skills: formState.skills,
      expertises: updatedExpertises,
      experiences: newExperiences,
    };

    dispatch(updateUser(updatedUser));

    if (formStorageKey) {
      localStorage.setItem(formStorageKey, JSON.stringify(profileSettings));
    }

    setIsEditOpen(false);
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p>Loading user profile...</p>
      </div>
    );
  }

  const currentTitle = user.experiences?.length > 0 
    ? user.experiences[0].title 
    : "Expert";

  const fullName = `${user.firstName} ${user.lastName || ""}`.trim();

  return (
    <div className="main-content min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Back to Browse
        </button>
        <div className="flex gap-3">
          <button className="btn btn-outline text-sm">Share Profile</button>
          <button className="btn btn-outline text-sm">Save</button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary">
            <img
              src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + fullName}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white">{fullName}</h1>
            <p className="text-sm text-slate-400">{currentTitle}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current opacity-50" />
              </div>
              <span className="font-medium text-slate-200">4.9</span>
              <span className="text-slate-400">(27 reviews)</span>
            </div>

            {/* Meta tags */}
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Mon, Tue, Wed, Thu
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 10+ years
              </span>
              <span className="flex items-center gap-1.5 text-green-400">
                <CreditCard className="h-3.5 w-3.5" /> ${user.coachCost} / hour
              </span>
            </div>

            {/* Expertises */}
            {user.expertises && user.expertises.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-xs text-slate-400">Areas of Expertise</span>
                <div className="flex flex-wrap gap-2">
                  {user.expertises.map((exp) => (
                    <span key={exp.id} className="badge bg-secondary text-secondary-foreground">
                      {exp.expertiseName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-3 sm:w-auto">
          <button className="btn btn-primary flex-1 sm:flex-none">
            Book a Session
          </button>
          <button className="btn btn-secondary flex-1 sm:flex-none">
            Message
          </button>
          <button className="btn btn-outline text-sm" onClick={handleOpenEdit}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-border">
        {["About", "Experience", "Testimonials", "Availability"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: ABOUT & EXPERIENCE */}
      <div className="flex flex-col gap-8">
        {/* ABOUT SECTION */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-white">About {fullName}</h2>
          <p className="mb-6 text-sm text-slate-300 leading-relaxed">
            {user.description || 
              "This user has not provided a description yet. They are a highly skilled professional ready to help you achieve your goals."}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Mentorship Style */}
            <div className="stats-card">
              <h3 className="mb-3 font-semibold text-white">Mentorship Style</h3>

              <ul className="flex flex-col gap-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Practical, hands-on learning approach
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Focus on real-world projects and examples
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Personalized guidance based on individual goals
                </li>
              </ul>
            </div>

            {/* Languages */}
            <div className="stats-card">
              <h3 className="mb-3 font-semibold text-white">Languages</h3>
              <ul className="flex flex-col gap-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  English (Native)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Spanish (Conversational)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section>
          <h2 className="mb-2 text-lg font-bold text-white">Experience</h2>
          <p className="mb-4 text-xs text-slate-400 uppercase tracking-wider">Work History</p>
          
          <div className="flex flex-col gap-3">
            {user.experiences && user.experiences.length > 0 ? (
              user.experiences.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between rounded-xl bg-card p-5 border border-border">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{exp.title}</span>
                    <span className="text-sm text-slate-400">{exp.description || "Tech Company"}</span> 
                  </div>

                  <div className="text-sm text-slate-400">
                    {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No experience.</p>
            )}
          </div>
        </section>
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-12">
          <div className="w-full max-w-4xl rounded-[28px] border border-border bg-slate-950 p-8 shadow-2xl shadow-black/50">
            
            {/* Modal Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-4">
              <div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mb-2 flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <h2 className="text-2xl font-bold text-white">Edit Your Profile</h2>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-amber-400">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs font-medium">Hybrid Profile View (Mentor & Trainee)</span>
              </div>
            </div>

            {/* Form Body */}
            <div className="space-y-8">
              
              {/* Basic Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Basic Information</h3>
                <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
                  {/* Avatar Upload Container */}
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 text-center h-50">
                    <div className="relative mb-3 flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-slate-600 bg-slate-900 text-slate-500">
                      <span className="text-3xl font-bold">{fullName.charAt(0)}</span>
                    </div>

                    {/* TODO: Implement avatar image processing slice and connect with AWS S3 / Cloudinary upload */}
                    <p className="text-xs font-medium text-slate-300">Upload photo</p>
                    <p className="text-[10px] text-slate-500 mt-1">Coming Soon [Global]</p>
                  </div>

                  {/* Input Fields */}
                  <div className="grid gap-4">
                    <div>
                      <label className="label text-xs font-semibold text-slate-300" htmlFor="fullName">Full Name *</label>
                      <input
                        id="fullName"
                        value={fullNameInput}

                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === " ") return;

                          setFullNameInput(value);

                          if (value === "") {
                            setFormState((prev) => ({ ...prev, firstName: "", lastName: "" }));
                            return;
                          }

                          const firstSpaceIndex = value.indexOf(" ");
                          if (firstSpaceIndex === -1) {
                            setFormState((prev) => ({
                              ...prev,
                              firstName: value,
                              lastName: ""
                            }));
                          } else {
                            // First word is FirstName
                            const firstName = value.substring(0, firstSpaceIndex);
                            // Else are LastName (keep spaces)
                            const lastName = value.substring(firstSpaceIndex + 1);

                            setFormState((prev) => ({
                              ...prev,
                              firstName: firstName,
                              lastName: lastName,
                            }));
                          }
                        }}
                        className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                        placeholder="Trương Trịnh Văn"
                      />
                    </div>

                    <div>
                      {/* TODO: Extend Backend UpdateUserProfileCommand properties to persist PhoneNumber data column */}
                      <label className="label text-xs font-semibold text-slate-300" htmlFor="phoneNumber">
                        Phone Number <span className="text-amber-500 font-normal text-[11px] ml-1">(Coming Soon [Global])</span>
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        value={formState.phoneNumber}
                        onChange={(event) => updateFormField("phoneNumber", event.target.value)}
                        className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Skills Textareas */}
              <div className="grid gap-4">
                <div>
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    value={formState.description}
                    onChange={(event) => updateFormField("description", event.target.value)}
                    className="textarea w-full h-24 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="skills">Professional Skills</label>
                  <input
                    id="skills"
                    value={formState.skills}
                    onChange={(event) => updateFormField("skills", event.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                    placeholder="e.g. JavaScript, Python, Project Management"
                  />
                </div>

                <div>
                  {/* TODO: Map IndustryExperience safely into the Experiences[0].Title slice array block node */}
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="industryExperience">
                    Industry Experience <span className="text-blue-500 font-normal text-[11px] ml-1">[For Mentor]</span>
                  </label>
                  <input
                    id="industryExperience"
                    value={formState.industryExperience}
                    onChange={(event) => updateFormField("industryExperience", event.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                    placeholder="e.g. 5 years in Software Development"
                  />
                </div>
              </div>

              {/* Areas of Expertise */}
              <div>
                <p className="label text-xs font-semibold text-slate-300 mb-2">Areas of Expertise *</p>
                <div className="flex flex-wrap gap-2">
                  {expertiseOptions.map((expertise) => {
                    const selected = formState.selectedExpertiseNames.includes(expertise);
                    return (
                      <button
                        key={expertise}
                        type="button"
                        onClick={() => {
                          const isSelected = formState.selectedExpertiseNames.includes(expertise);
                          setFormState((prev) => ({
                            ...prev,
                            selectedExpertiseNames: isSelected
                              ? prev.selectedExpertiseNames.filter((item) => item !== expertise)
                              : [...prev.selectedExpertiseNames, expertise],
                          }));
                        }}
                        className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                          selected
                            ? "bg-primary text-white"
                            : "bg-slate-900 text-slate-400 border border-slate-800/60 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {expertise}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Learning Styles */}
              <div>
                <p className="label text-xs font-semibold text-slate-300 mb-2">
                  Learning Styles * <span className="text-emerald-500 font-normal text-[11px] ml-1">[For Trainee] (LocalStorage Save)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {learningStyleOptions.map((option) => {
                    const selected = profileSettings.learningStyles.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleProfileSetting("learningStyles", option)}
                        className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                          selected
                            ? "bg-primary text-white"
                            : "bg-slate-900 text-slate-400 border border-slate-800/60 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div>
                <p className="label text-xs font-semibold text-slate-300 mb-2">
                  Availability * <span className="text-amber-500 font-normal text-[11px] ml-1">(Coming Soon [Global] - LocalStorage Save)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map((option) => {
                    const selected = profileSettings.availability.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleProfileSetting("availability", option)}
                        className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                          selected
                            ? "bg-primary text-white"
                            : "bg-slate-900 text-slate-400 border border-slate-800/60 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Communication Method */}
              <div>
                <p className="label text-xs font-semibold text-slate-300 mb-2">
                  Preferred Communication Method * <span className="text-amber-500 font-normal text-[11px] ml-1">(Coming Soon [Global] - LocalStorage Save)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {communicationOptions.map((option) => {
                    const selected = profileSettings.communicationMethods.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleProfileSetting("communicationMethods", option)}
                        className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                          selected
                            ? "bg-primary text-white"
                            : "bg-slate-900 text-slate-400 border border-slate-800/60 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topics of Interest */}
              <div>
                <p className="label text-xs font-semibold text-slate-300 mb-2">
                  Topics of Interest * <span className="text-emerald-500 font-normal text-[11px] ml-1">[For Trainee] (LocalStorage Save)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {topicOptions.map((option) => {
                    const selected = profileSettings.topicsOfInterest.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleProfileSetting("topicsOfInterest", option)}
                        className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                          selected
                            ? "bg-primary text-white"
                            : "bg-slate-900 text-slate-400 border border-slate-800/60 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* What do you hope to learn? */}
              <div>
                <label className="label text-xs font-semibold text-slate-300" htmlFor="hopeToLearn">
                  What do you hope to learn? * <span className="text-emerald-500 font-normal text-[11px] ml-1">[For Trainee] (LocalStorage Save)</span>
                </label>
                <textarea
                  id="hopeToLearn"
                  value={profileSettings.hopeToLearn}
                  onChange={(event) => setProfileSettings((prev) => ({ ...prev, hopeToLearn: event.target.value }))}
                  className="textarea w-full h-24 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                  placeholder="1111"
                />
              </div>

              {/* Session Frequency & Duration */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="sessionFrequency">
                    Session Frequency * <span className="text-amber-500 font-normal text-[11px] ml-1">(Coming Soon [Global])</span>
                  </label>
                  <select
                    id="sessionFrequency"
                    value={profileSettings.sessionFrequency}
                    onChange={(event) => setProfileSettings((prev) => ({ ...prev, sessionFrequency: event.target.value }))}
                    className="select w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                  >
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="sessionDuration">
                    Session Duration * <span className="text-amber-500 font-normal text-[11px] ml-1">(Coming Soon [Global])</span>
                  </label>
                  <select
                    id="sessionDuration"
                    value={profileSettings.sessionDuration}
                    onChange={(event) => setProfileSettings((prev) => ({ ...prev, sessionDuration: event.target.value }))}
                    className="select w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                  >
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>90 Minutes</option>
                    <option>2 Hours</option>
                  </select>
                </div>
              </div>

              {/* Privacy/Settings Checkboxes */}
              <div className="grid gap-3 pt-4 md:grid-cols-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-900 bg-slate-900/40 px-4 py-4 text-xs font-medium text-slate-400 transition hover:border-slate-800 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={profileSettings.privateProfile}
                    onChange={(event) => setProfileSettings((prev) => ({ ...prev, privateProfile: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-primary"
                  />
                  <div className="flex flex-col">
                    <span>Private profile</span>
                    <span className="text-[10px] text-slate-500 font-normal">Coming Soon [Global]</span>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-900 bg-slate-900/40 px-4 py-4 text-xs font-medium text-slate-400 transition hover:border-slate-800 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={profileSettings.allowMessages}
                    onChange={(event) => setProfileSettings((prev) => ({ ...prev, allowMessages: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-primary"
                  />
                  <div className="flex flex-col">
                    <span>Allow messages</span>
                    <span className="text-[10px] text-slate-500 font-normal">Coming Soon [Global]</span>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-900 bg-slate-900/40 px-4 py-4 text-xs font-medium text-slate-400 transition hover:border-slate-800 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={profileSettings.receiveNotifications}
                    onChange={(event) => setProfileSettings((prev) => ({ ...prev, receiveNotifications: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-primary"
                  />
                  <div className="flex flex-col">
                    <span>Receive notifications</span>
                    <span className="text-[10px] text-slate-500 font-normal">Coming Soon [Global]</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-900 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline border-slate-800 text-slate-300 rounded-xl text-sm w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm w-full sm:w-auto px-6"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};