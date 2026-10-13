'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { certificationsData } from '@/data/portfolio';

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="mb-28 max-w-[53rem] w-full scroll-mt-28 text-center sm:mb-40"
    >
      <motion.h2
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Certifications
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificationsData.map((certification, index) => (
          <motion.div
            key={certification}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left"
          >
            <Award className="w-5 h-5 flex-shrink-0 text-gray-400" />
            <span className="font-medium">{certification}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
