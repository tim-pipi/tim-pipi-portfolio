'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

const experienceData = [
  {
    title: 'Full-stack Developer Intern',
    company: 'HomePal Technologies',
    location: 'Singapore',
    description: [
      'Built AI-enabled fall detection mobile application using Flutter and Django, integrating with Firebase for real-time elderly care monitoring',
      'Developed cross-platform interfaces using Tkinter and Python Dash for Raspberry Pi, streamlining ML model training workflows and improving processing speed by 300%',
    ],
    technologies: 'Flutter, Firebase, Django, Tkinter, Dash',
    date: 'Aug 2023 - Dec 2024',
    imageUrl: '/homepal.jpg',
  },
  {
    title: 'Software Engineer Intern',
    company: 'CareSense',
    location: 'Singapore',
    description: [
      'Led Android development for healthcare application, implementing secure authentication and health data integration using Google APIs',
      'Developed cross-platform mobile features using React Native and Expo framework for AI health coach integration',
    ],
    technologies:
      'React Native, Expo, Google APIs (Login, Fit, Health Connect), Android Development',
    date: 'Oct 2024 - Dec 2024',
    imageUrl: '/caresenseai.jpg',
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
    >
      <h2 className="text-3xl font-bold mb-8">Experience</h2>
      <div className="flex flex-col gap-8">
        {experienceData.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex flex-col sm:flex-row gap-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-left"
          >
            <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {experience.imageUrl ? (
                <Image
                  src={experience.imageUrl}
                  alt={`${experience.company} logo`}
                  className="object-cover"
                  fill
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{experience.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2 flex flex-wrap gap-2 items-center">
                <span>{experience.company}</span>
                <span>•</span>
                <span>{experience.location}</span>
                <span>•</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {experience.date}
                </span>
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                {experience.description.map((point, pointIndex) => (
                  <li key={pointIndex} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Technologies:</span>{' '}
                {experience.technologies}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}