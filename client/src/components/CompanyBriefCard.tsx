/*this component is responsible for rendering a brief overview of a company, including its summary, what they do, hiring process, and tech stack. It takes in four props: summary, what_they_do, hiring_process, and tech_stack. The component uses Tailwind CSS for styling and displays the information in a visually appealing card format. The tech stack is displayed as a list of badges. */

interface CompanyBriefProps {
  summary: string;
  what_they_do: string;
  hiring_process: string;
  tech_stack: string[];
}

export default function CompanyBriefCard({
  summary,
  what_they_do,
  hiring_process,
  tech_stack,
}: CompanyBriefProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Company Research
      </h2>

      <p className="text-slate-300 leading-7">{summary}</p>

      <div className="mt-5">
        <h3 className="font-semibold text-white mb-2">
          What they do
        </h3>
        <p className="text-slate-400">{what_they_do}</p>
      </div>

      <div className="mt-5">
        <h3 className="font-semibold text-white mb-2">
          Hiring Process
        </h3>
        <p className="text-slate-400">{hiring_process}</p>
      </div>

      <div className="mt-5">
        <h3 className="font-semibold text-white mb-2">
          Tech Stack
        </h3>

        <div className="flex flex-wrap gap-2">
          {tech_stack.map((tech) => (
            <span
              key={tech}
              className="bg-slate-700 px-3 py-1 rounded-full text-sm text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}