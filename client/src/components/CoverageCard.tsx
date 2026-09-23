/*this component is responsible for rendering a coverage card that displays the skill coverage information for a user's resume. It takes in three props: percentage, covered, and missing. The percentage prop represents the percentage of skills covered by the user's resume, while the covered and missing props are arrays of strings representing the skills that are covered and missing, respectively. The component uses Tailwind CSS for styling and displays the coverage information in a visually appealing manner, including a progress bar and lists of covered and missing skills. */

interface CoverageProps {
  percentage: number;
  covered: string[];
  missing: string[];
}

export default function CoverageCard({
  percentage,
  covered,
  missing,
}: CoverageProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-5 text-white">
        Skill Coverage
      </h2>

      <div className="mb-5">
        <div className="flex justify-between mb-2 text-white">
          <span>Resume Match</span>
          <span className="font-bold">{percentage}%</span>
        </div>

        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-emerald-400 mb-3">
            Covered Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {covered.map((skill) => (
              <span
                key={skill}
                className="bg-emerald-600 px-3 py-1 rounded-full text-sm text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-red-400 mb-3">
            Missing Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {missing.length ? (
              missing.map((skill) => (
                <span
                  key={skill}
                  className="bg-red-600 px-3 py-1 rounded-full text-sm text-white"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-400 text-sm">
                No missing skills 🎉
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}