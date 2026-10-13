'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { experienceData, leadershipData } from '@/data/portfolio';

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
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-left"
      >
        <h3 className="text-xl font-semibold mb-2">Leadership</h3>
        <ul className="text-gray-700 dark:text-gray-300 space-y-3">
          {leadershipData.map((item) => (
            <li key={item.title}>
              <p>
                <span className="font-medium">{item.title}</span>,{' '}
                {item.organisation}
                {item.date && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {' '}
                    • {item.date}
                  </span>
                )}
              </p>
              {item.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
