'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';

export default function Contact() {
  return (
    <motion.section
      id="contact"
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <h2 className="text-3xl font-bold mb-8">Contact</h2>

      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Feel free to reach out to me! I'm always open to discussing new
        opportunities and interesting projects.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="mailto:timothyputraprasetio@gmail.com"
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
        >
          <Mail className="opacity-70" size={20} />
          Email me!
        </a>

        <div className="flex gap-4">
          <a
            href="https://github.com/tim-pipi"
            target="_blank"
            className="bg-white p-4 text-gray-700 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          >
            <Github size={20} />
          </a>

          <a
            href="https://linkedin.com/in/timpipi"
            target="_blank"
            className="bg-white p-4 text-gray-700 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </motion.section>
  );
} 