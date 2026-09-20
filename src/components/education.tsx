'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const educationData = [
  {
    institution: 'National University of Singapore',
    qualification: 'Bachelor of Computing in Computer Science',
    date: 'Aug 2022 - May 2026',
  },
  {
    institution: 'NUS College',
    qualification: "Bachelor's Degree",
    date: 'Aug 2022 - Aug 2026',
  },
  {
    institution: 'Anglo-Chinese School (Independent)',
    qualification: 'International Baccalaureate',
    date: 'Feb 2020 - Nov 2021',
  },
];

export default function Education() {
  return (
    <section
      id="education"
      className="mb-28 max-w-[53rem] w-full scroll-mt-28 text-center sm:mb-40"
    >
      <motion.h2
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Education
      </motion.h2>
      <div className="flex flex-col gap-4">
        {educationData.map((education, index) => (
          <motion.div
            key={education.institution}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-left"
          >
            <GraduationCap className="w-6 h-6 flex-shrink-0 mt-1 text-gray-400" />
            <div>
              <h3 className="text-xl font-semibold">{education.institution}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {education.qualification}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {education.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
