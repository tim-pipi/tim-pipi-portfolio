'use client';

import React from 'react';
import { motion } from 'framer-motion';

const skillsData = [
  {
    category: 'Programming Languages',
    skills: [
      'Java',
      'Python',
      'C++',
      'JavaScript',
      'TypeScript',
      'Golang',
      'Dart',
      'SQL',
    ],
  },
  {
    category: 'Frontend Development',
    skills: ['React', 'HTML/CSS', 'Flutter', 'React Native', 'Tkinter'],
  },
  {
    category: 'Backend Development',
    skills: ['Spring Boot', 'Django', 'Firebase', 'MongoDB'],
  },
  {
    category: 'Tools & Infrastructure',
    skills: ['Git', 'Docker', 'PostgreSQL', 'RabbitMQ', 'WebSocket'],
  },
];

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
    >
      <h2 className="text-3xl font-bold mb-8">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillsData.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * categoryIndex }}
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
            <ul className="flex flex-wrap justify-center gap-2">
              {category.skills.map((skill, index) => (
                <motion.li
                  key={skill}
                  variants={fadeInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  custom={index}
                  className="bg-white dark:bg-gray-900 px-4 py-2 rounded-full text-sm font-medium 
                           hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  {skill}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
