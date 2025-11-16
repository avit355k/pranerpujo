import React from "react";
import { motion } from "framer-motion";

const pujaSchedule = [
  {
    year: 2024,
    events: [
      { day: "Mahalaya", date: "October 2, 2024" },
      { day: "Shashthi", date: "October 8, 2024" },
      { day: "Saptami", date: "October 9, 2024" },
      { day: "Ashtami", date: "October 10, 2024" },
      { day: "Navami", date: "October 11, 2024" },
      { day: "Dashami", date: "October 12, 2024" },
    ],
  },
  {
    year: 2025,
    events: [
      { day: "Mahalaya", date: "September 22, 2025" },
      { day: "Shashthi", date: "September 29, 2025" },
      { day: "Saptami", date: "September 30, 2025" },
      { day: "Ashtami", date: "October 1, 2025" },
      { day: "Navami", date: "October 2, 2025" },
      { day: "Dashami", date: "October 3, 2025" },
    ],
  },
  {
    year: 2026,
    events: [
      { day: "Mahalaya", date: "October 10, 2026" },
      { day: "Shashthi", date: "October 17, 2026" },
      { day: "Saptami", date: "October 18, 2026" },
      { day: "Ashtami", date: "October 19, 2026" },
      { day: "Navami", date: "October 20, 2026" },
      { day: "Dashami", date: "October 21, 2026" },
    ],
  },
];

const Schedule = () => {
  return (
    <section className="py-16 px-8 md:px-16 lg:px-24 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <motion.h1
        className="text-4xl font-bold text-center text-red-600 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Durga Puja Schedule
      </motion.h1>

      <div className="space-y-16">
        {pujaSchedule.map((yearData, index) => (
          <motion.div
            key={yearData.year}
            className="bg-white dark:bg-neutral-900 shadow-md rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-red-600 text-white text-center py-4 text-2xl font-bold">
              Durga Puja {yearData.year}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-center">
                <thead>
                  <tr className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100">
                    <th className="py-3 px-6 border-b border-neutral-300 dark:border-neutral-700 text-lg">
                      Day
                    </th>
                    <th className="py-3 px-6 border-b border-neutral-300 dark:border-neutral-700 text-lg">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {yearData.events.map((event, i) => (
                    <tr
                      key={event.day}
                      className={`${
                        i % 2 === 0
                          ? "bg-neutral-100 dark:bg-neutral-800/50"
                          : "bg-white dark:bg-neutral-900"
                      } hover:bg-red-50 dark:hover:bg-neutral-800 transition`}
                    >
                      <td className="py-3 px-6 border-b border-neutral-200 dark:border-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
                        {event.day}
                      </td>
                      <td className="py-3 px-6 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {event.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Schedule;
