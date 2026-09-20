'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

type ExperienceItem = {
  title: string;
  company: string;
  location: string;
  description: string[];
  technologies?: string;
  date: string;
  imageUrl: string;
};

const experienceData: ExperienceItem[] = [
  {
    title: 'Software Engineer',
    company: 'Rakuten Asia',
    location: 'Singapore',
    // TODO: add bullet points describing this role
    description: [],
    date: 'Jul 2026 - Present',
    imageUrl: '',
  },
  {
    title: 'Software Engineer Intern',
    company: 'Rakuten Asia',
    location: 'Singapore',
    // TODO: add bullet points describing this role
    description: [],
    date: 'May 2025 - Jul 2026',
    imageUrl: '',
  },
  {
    title: 'Software Engineer Intern',
    company: 'CareSense.ai',
    location: 'Singapore',
    description: [
      'Developed a mobile application with Expo to improve healthcare through the help of an intelligent automated health coach',
      'Led Android development for the healthcare application, implementing secure authentication and health data integration using Google APIs',
    ],
    technologies:
      'React Native, Expo, Google APIs (Login, Fit, Health Connect), Android Development',
    date: 'Oct 2024 - May 2025',
    imageUrl: '/caresenseai.jpg',
  },
  {
    title: 'Teaching Assistant',
    company: 'National University of Singapore',
    location: 'Singapore',
    description: [
      'Taught CS1101S (Programming Methodology I) across AY23/24 Sem 1 and AY24/25 Sem 1',
      'Taught CS2103T (Software Engineering) across AY24/25 Sem 1 and Sem 2',
      'Taught CS2030S (Programming Methodology II) in AY23/24 Sem 2 and GEA1000N (Reasoning with Data) in AY22/23 Sem 2',
      'Recognised on the Honour List of Student Tutors for teaching excellence',
    ],
    date: 'Aug 2023 - May 2025',
    imageUrl: '',
  },
  {
    title: 'Full Stack Developer Intern',
    company: 'HomePal',
    location: 'Singapore',
    description: [
      'Built a mobile application using Flutter and Firebase to notify users of AI-detected falls, improving real-time alert efficiency for elderly care',
      'Designed and developed a GUI using Tkinter for Raspberry Pi, streamlining data interaction for machine learning model training, resulting in a 300% increase in processing speed',
      "Extended accessibility of Raspberry Pi's GUI by implementing a cross-platform web-based application using Python Dash, enhancing usability for diverse platforms",
      'Collaborated with cross-functional teams to integrate AI algorithms into applications, enhancing the reliability and accuracy of fall detection systems',
    ],
    technologies: 'Flutter, Firebase, Tkinter, Dash',
    date: 'Aug 2023 - Feb 2025',
    imageUrl: '/homepal.jpg',
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
    >
      <motion.h2
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Experience
      </motion.h2>
      <div className="flex flex-col gap-8">
        {experienceData.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
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
              {experience.description.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                  {experience.description.map((point, pointIndex) => (
                    <li key={pointIndex} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              {experience.technologies && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Technologies:</span>{' '}
                  {experience.technologies}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
