import { useState } from "react";
import { PlusCircle, CalendarDays, Trash2 } from "lucide-react";

// mock image pool by type
const defaultImages = {
  food: "https://images.unsplash.com/photo-1555992336-03a23caa7d52?w=800",
  park: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
  art: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800",
  default: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
};

export default function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([]);
  const [plan, setPlan] = useState({}); // {day: [activity, activity...]}

  // simple month grid
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const addActivity = (e) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    const category = e.target.category.value.trim().toLowerCase();
    const link = e.target.link.value.trim();
    if (!title) return;
    const newAct = {
      id: Date.now(),
      title,
      category,
      link,
      image: defaultImages[category] || defaultImages.default,
    };
    setActivities((prev) => [...prev, newAct]);
    e.target.reset();
  };

  const addToDay = (day, act) => {
    setPlan((prev) => {
      const prevDay = prev[day] || [];
      return { ...prev, [day]: [...prevDay, act] };
    });
  };

  const removeActivity = (day, id) => {
    setPlan((prev) => {
      const filtered = (prev[day] || []).filter((a) => a.id !== id);
      return { ...prev, [day]: filtered };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-orange-100 to-purple-200 text-gray-800 p-6">
      <h1 className="text-4xl font-bold text-center mb-1">we should hangout</h1>
      <p className="text-center mb-8 opacity-80">let’s make it happen.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white/70 rounded-xl shadow p-4 backdrop-blur">
          <h2 className="font-semibold flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5" /> Choose a day
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition 
                ${
                  selectedDay === d
                    ? "bg-pink-400 text-white"
                    : "bg-white/50 hover:bg-pink-100"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Activity pool */}
        <div className="bg-white/70 rounded-xl shadow p-4 backdrop-blur">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Add an activity
          </h2>
          <form onSubmit={addActivity} className="flex flex-col gap-2">
            <input
              name="title"
              placeholder="Activity name (ex: Picnic at park)"
              className="rounded-md border border-gray-300 px-2 py-1"
            />
            <input
              name="category"
              placeholder="Category (food, park, art...)"
              className="rounded-md border border-gray-300 px-2 py-1"
            />
            <input
              name="link"
              placeholder="Optional link (Google Maps / Yelp)"
              className="rounded-md border border-gray-300 px-2 py-1"
            />
            <button
              type="submit"
              className="mt-1 bg-pink-400 text-white py-1 rounded-md hover:bg-pink-500 transition"
            >
              Add
            </button>
          </form>

          <div className="mt-4 space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-2 bg-white/60 rounded-md flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium">{act.title}</p>
                  <p className="text-xs opacity-70">{act.category}</p>
                </div>
                <button
                  onClick={() => addToDay(selectedDay, act)}
                  disabled={!selectedDay}
                  className="text-sm bg-pink-300 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                  Add to Day {selectedDay || "?"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily plan */}
        <div className="bg-white/70 rounded-xl shadow p-4 backdrop-blur">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Plan for Day{" "}
            {selectedDay || "?"}
          </h2>

          {selectedDay ? (
            <div className="space-y-3">
              {(plan[selectedDay] || []).length === 0 && (
                <p className="text-sm opacity-70">
                  No activities yet. Add some from the pool →
                </p>
              )}
              {(plan[selectedDay] || []).map((a) => (
                <div
                  key={a.id}
                  className="p-2 bg-white rounded-lg flex items-center gap-2 shadow-sm"
                >
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{a.title}</p>
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-pink-500 underline"
                      >
                        {a.link.length > 30
                          ? a.link.slice(0, 30) + "..."
                          : a.link}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => removeActivity(selectedDay, a.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-70">
              Select a day to see or build your plan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

