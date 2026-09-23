/*this component is responsible for rendering a roadmap card that displays the preparation roadmap for a specific interview kit. It takes in a single prop, roadmap, which is an array of objects representing each day of the roadmap. Each object contains the day number, title, topics covered, and practice task for that day. The component uses Tailwind CSS for styling and displays the information in a visually appealing card format. */

interface RoadmapDay {
  day: number;
  title: string;
  topics: string[];
  practiceTask: string;
}

interface RoadmapCardProps {
  roadmap: RoadmapDay[];
}

export default function RoadmapCard({
  roadmap,
}: RoadmapCardProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Preparation Roadmap
      </h2>

      {roadmap.map((day) => (
        <div
          key={day.day}
          className="bg-slate-900 border border-slate-800 rounded-xl p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-white">
              Day {day.day} · {day.title}
            </h3>

            <span className="text-blue-400 text-sm">
              Day {day.day}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-sm text-slate-400 mb-2">
              Topics
            </p>

            <div className="flex flex-wrap gap-2">
              {day.topics.map((topic) => (
                <span
                  key={topic}
                  className="bg-slate-700 px-3 py-1 rounded-full text-sm text-white"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">
              Practice Task
            </p>

            <p className="text-slate-300">
              {day.practiceTask}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}